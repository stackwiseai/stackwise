import { createClient } from "@supabase/supabase-js";

const supabaseUrl = String(process.env.SUPABASE_URL);
const supabaseKey = String(process.env.SUPABASE_KEY);
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Listen to database changes using supabase
 */
export default async function listenToDatabaseChanges({
  channel_name,
  table_name,
  event = "*",
  schema = "public",
  callback,
}: {
  /**
   * Name of the real-time channel you want to listen to.
   */
  channel_name: string;
  /**
   * table_name name of the table to listen for changes.
   *
   * When undefined, you listen to all tables.
   */
  table_name?: string;
  /**
   * event an optional 'event' name that the listener will only capture. @defaultValue "*" (all)
   */
  event?: "INSERT" | "UPDATE" | "DELETE" | "*";
  /**
   * schema an optional 'schema' that the listener will only capture. (e.g. "*") @defautlValue "public"
   */
  schema?: string;
  /**
   * callback function that gets called whenever the real-time event is emitted.
   * @param payload the data from the event.
   */
  callback: (payload: any) => void;
}): Promise<any> {
  try {
    const channel = supabase
      .channel(channel_name)
      .on(
        "postgres_changes",
        { event: event, schema: schema, table: table_name },
        callback
      );

    channel.subscribe();

    return channel;
  } catch (error) {
    console.error(error);
  }
}
