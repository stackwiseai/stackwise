/**
 * Brief: Make a function that moves an item from an index to another index.
 */
export default async function arrayMove(array, from, to) {
  const newArray = [...array];
  const [movedItem] = newArray.splice(from, 1);
  newArray.splice(to, 0, movedItem);
  return newArray;
}
