// import React from 'react'
// import Link from 'next/link'
// import navStyles from '../styles/Navbar.module.css'
// import { RiMenu3Line, RiCloseLine } from 'react-icons/ri'

// function Navbar() {

//   const [toggleMenu, setToggleMenu] = React.useState(false)
//   return (
//     <div className={navStyles.navContainer}>
//         <div className={navStyles.navbar}>
//           <div className={navStyles.navbar_links}>
//               <div className={navStyles.navbar_links_logo}>
//                   <Link href="/" passHref><h1> ΞXC NFT</h1></Link>
//               </div>
//               <div className={navStyles.navbar_links_container}>
//                 <a href="#Mint"><p>Mint ΞXC</p></a>
//                 <p>Stake ΞXC</p>
//                 <p>NFT Marketplace</p>
//                 <p>Contact</p>
//                 <p>Learn More...</p>
//               </div>
//           </div>
//           <div className={navStyles.navbar_button}>
//             <button >Connect Wallet</button>
//           </div>
//           <div className={navStyles.navbar_menu}>
//             {toggleMenu 
//             ? <RiCloseLine color="#fff" size={26} onClick ={() => (setToggleMenu(false))}/>
//             : <RiMenu3Line color="#fff" size={26} onClick ={() => (setToggleMenu(true))}/>
//             }

//             {toggleMenu && (
//               <div className={navStyles.navbar_menu_container}>
//                 <div className={navStyles.navbar_menu_links}>
//                     <>
//                         <p>Mint ΞXC</p>
//                         <p>Stake ΞXC</p>
//                         <p>NFT Marketplace</p>
//                         <p>Contact</p>
//                         <p>Learn More...</p>
//                     </>
//                   <div className={navStyles.navbar_menu_container_button}>
//                     <button >Connect Wallet</button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//       </div>
//     </div>
    
//   )
// }

// export default Navbar