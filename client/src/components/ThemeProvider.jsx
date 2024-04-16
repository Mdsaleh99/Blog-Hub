import { useSelector } from 'react-redux';

export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  return (
    <div className={theme}>
      <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen'>
        {children}
      </div>
    </div>
  );
}


// this below fuction is not working properly but above function is working properly even though both are same
// import { useSelector } from 'react-redux'

// export default function ThemeProvider({ children }) {
//     const { theme } = useSelector((state) => state.theme)
//   return (
//     <div className={theme}>
//         <div className='bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16, 23, 42)] min-h-screen'>
//             {children}
//         </div>
//     </div>
//   )
// }
