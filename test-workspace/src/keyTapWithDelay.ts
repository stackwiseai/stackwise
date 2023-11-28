import * as robot from 'robotjs';

/**
 * Function to perform key tap with a delay
 * @param key - The key to tap.
 * @param modifier - The modifier key.
 * @param waitTime - Time to wait after key tap.
 */
export async function keyTapWithDelay(key: string, modifier: string | null, waitTime: number): Promise<void> {
    console.log('key: ' + key);
    console.log('modifier: ' + modifier);

    if (modifier) {
        robot.keyTap(key, modifier);
    } else {
        robot.keyTap(key);
    }

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    await delay(waitTime);
}
