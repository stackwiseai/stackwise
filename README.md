# Stackwise: Plug and play functions within your workflow.

[![Discord Follow](https://dcbadge.vercel.app/api/server/KfUxa8h3s6?style=flat)](https://discord.gg/KfUxa8h3s6) [![GitHub Repo stars](https://img.shields.io/github/stars/stackwiseai/stackwise?style=social)](https://github.com/stackwiseai/stackwise/stargazers) [![Twitter Follow](https://img.shields.io/twitter/follow/stackwiseai?style=social)](https://twitter.com/stackwiseai) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Stackwise allows you to focus more on what you want to be building, instead of the minutae that come with it. Simply precise what the block of code should do, and Stackwise will create the functionality you desire.

# demo here

### Usage

Stackwise introduces a straightforward command structure, where you specify a 'brief' for the desired action, along with the inputs and outputs:

```typescript
stack("brief describing a specific action", {
    in: /* single input or object {} with multiple inputs */,
    out: // same as above, but output
})
```

The input and output are optional, meaning you will get a fully typed function even if you just use:

```typescript
stack('brief');
```

This approach streamlines API interactions, reducing the need for intricate coding and extensive API knowledge. Fully typed, and editable within your repo.

Upon saving your command, Stackwise replaces it with a collapsed function with your inputs and an import statement at the top of your file. The generated code resides in the /stacks directory within your project root, ensuring clean and maintainable codebase.

### Special Note for NextJS Developers

NextJS developers can leverage Stackwise for server actions, making API integrations even smoother. Here’s an example demonstrating the use of Stackwise in a NextJS environment:

![example image](example.png)

### Current Integrations

Stackwise currently integrates with three APIs:

- Replicate
- OpenAI
- Pinecone

Contributions to improve these or add new integrations are welcome. If you're interested in expanding Stackwise's capabilities, feel free to submit a pull request or contact us (join the Discord or contact@stackwise.ai) for collaboration.

### Getting Started

To start using Stackwise, follow these steps:

1. Clone the Stackwise repository:

```bash
git clone https://github.com/stackwiseai/stackwise.git
```

2. Open a separate repository where you intend to use Stackwise.
3. Set up the extension developer host with Stackwise.
4. Implement the stack(...) command in your project.
5. Save your file to see the function replaced with a generated implementation and import statement.

### Roadmap

Our future developments include:

- [ ] Interactive stack modification: Chat with your stack to refine and improve it.

- [ ] Dynamic input chains: Link multiple stacks to each other using dynamic inputs. Currently only static briefs work.

- [ ] Expand integrations: Continually adding more APIs based on community feedback. Let us know what you want to see next!

- [ ] API insights: See what APIs you're calling most and how what you're using them for.

- [ ] Non-collapsible stacks: Edit your stacks continuously without automatic collapsing. If something with the api changes, it will automatically heal to work.

### Join The Community

[![Discord Follow](https://dcbadge.vercel.app/api/server/KfUxa8h3s6?style=flat)](https://discord.gg/KfUxa8h3s6)

We welcome contributions, feedback, and suggestions to further enhance Stackwise.

We want to make API integration easy, without the hassle of reading documentation or ever leaving your IDE. If you made it here you're at the very least intruiged and we'd love to have you :)

---

This project is licensed under the [MIT License](LICENSE).
