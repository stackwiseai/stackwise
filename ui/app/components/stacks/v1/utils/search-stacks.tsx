// import { useState, useEffect, useRef } from 'react';
// import Fuse from 'fuse.js';
// import { stackDB } from '../stacks/stack-db';
// import { SubmitButton } from './input-with-button';
// import { Form } from './input-with-button';
// import { useRouter } from 'next/navigation';

// const SearchStacks = () => {
//   const [inputValue, setInputValue] = useState('');
//   const [suggestions, setSuggestions] = useState([]);
//   const router = useRouter();
//   const searchRef = useRef(null);

//   // Initialize Fuse with your stackDB data
//   const fuse = new Fuse(
//     Object.entries(stackDB).map(([id, { name }]) => ({ id, name })),
//     {
//       keys: ['name'],
//       includeScore: true,
//     }
//   );

//   useEffect(() => {
//     if (inputValue) {
//       const results = fuse.search(inputValue).map((result) => result.item.name);
//       setSuggestions(results);
//     } else {
//       setSuggestions([]);
//     }
//   }, [inputValue]);

//   useEffect(() => {
//     // Function to check if the click is outside the search component
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setSuggestions([]);
//       }
//     };

//     // Add event listener
//     document.addEventListener('mousedown', handleClickOutside);

//     // Cleanup the event listener
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, [searchRef]);

//   const handleSuggestionClick = (stackName) => {
//     const stackId = Object.keys(stackDB).find(
//       (key) => stackDB[key].name === stackName
//     );
//     if (stackId) {
//       router.push(`/stacks/${stackId}`);
//     }
//     setInputValue(stackName);
//     setSuggestions([]);
//   };

//   const handleInputFocus = () => {
//     if (inputValue) {
//       const results = fuse.search(inputValue).map((result) => result.item.name);
//       setSuggestions(results);
//     }
//   };

//   return (
//     <Form className="flex-col relative" ref={searchRef}>
//       <div className="relative w-full sm:w-3/4">
//         <input
//           type="text"
//           value={inputValue}
//           className="rounded-full w-full py-2 pl-4 pr-10 border border-gray-400 focus:outline-none focus:shadow-outline"
//           onChange={(e) => setInputValue(e.target.value)}
//           onFocus={handleInputFocus}
//           placeholder="Search stacks"
//         />
//         {suggestions.length > 0 && (
//           <ul className="absolute left-1/2 transform -translate-x-1/2 z-10 w-[95%] bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
//             {suggestions.map((stackName) => (
//               <li
//                 key={stackName}
//                 onClick={() => handleSuggestionClick(stackName)}
//                 className="cursor-pointer p-2 hover:bg-gray-100"
//               >
//                 {stackName}
//               </li>
//             ))}
//           </ul>
//         )}
//         <SubmitButton />
//       </div>
//     </Form>
//   );
// };

// export default SearchStacks;
