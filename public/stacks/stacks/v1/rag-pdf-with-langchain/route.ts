// app/api/ragPDFWithLangchain/route.ts
import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { WebPDFLoader } from 'langchain/document_loaders/web/pdf';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import { AIMessage, BaseMessage, HumanMessage } from 'langchain/schema';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';

export const runtime = 'nodejs';

const chatHistoryDelimiter = `||~||`;

// Function to create a HumanMessage or AIMessage based on the prefix
const createMessage = (text: string): BaseMessage => {
  if (text.startsWith('Q: ')) {
    return new HumanMessage({ content: text.slice(3) });
  } else if (text.startsWith('A: ')) {
    return new AIMessage({ content: text.slice(3) });
  } else {
    throw new Error('Unrecognized message type');
  }
};

// Function to transform the specially delimited string into ChatMessageHistory
const transformToChatMessageHistory = (
  chatString: string,
): ChatMessageHistory => {
  const messageHistory = new ChatMessageHistory();
  const messages = chatString.split(chatHistoryDelimiter);

  messages.forEach((messagePart) => {
    const trimmedMessage = messagePart.trim();
    if (trimmedMessage) {
      const message = createMessage(trimmedMessage);
      messageHistory.addMessage(message);
    }
  });

  return messageHistory;
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('pdf');
  const question = formData.get('question') as string;
  const chatHistoryValue = formData.get('chatHistory') as string;

  console.log('Received request:', { file, question });

  if (!file || !(file instanceof Blob)) {
    return new Response(
      JSON.stringify({ error: 'No PDF file provided or file is not a Blob' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  if (!question || typeof question !== 'string') {
    return new Response(
      JSON.stringify({ error: 'Question not provided or not a string' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  console.log('Processing PDF:', { file, question });

  try {
    const loader = new WebPDFLoader(file, { splitPages: true });
    const allDocs = await loader.load();
    const memoryVectorStore = await MemoryVectorStore.fromDocuments(
      allDocs,
      new OpenAIEmbeddings({ modelName: 'text-embedding-ada-002' }),
    );
    const llm = new ChatOpenAI({});
    const chatHistory = chatHistoryValue
      ? transformToChatMessageHistory(chatHistoryValue)
      : new ChatMessageHistory();

    const memory = new BufferMemory({
      chatHistory,
      memoryKey: 'chat_history', // Must be set to "chat_history"
    });

    const chain = ConversationalRetrievalQAChain.fromLLM(
      llm,
      memoryVectorStore.asRetriever(),
      {
        memory,
        qaChainOptions: {
          type: 'map_reduce',
        },
      },
    );

    const answer = (await chain.invoke({ question })).text;

    // Return the result as a JSON response
    return new Response(JSON.stringify({ answer }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Error processing PDF: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
