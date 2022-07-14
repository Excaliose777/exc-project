import styles from '../styles/Footer.module.css'
import Link from 'next/link'

function Footer() {
  return (
    <>
        <div className = {styles.footer} id="footer">
            <div className = {styles.title}>
            <Link href="/" passHref><h1> ΞXC NFT</h1></Link>
            </div>
            <div className={styles.footer_links}>
                <h4>Contact</h4>
                <a href="https://twitter.com/alaminxab" target="_blank"><p>Twitter</p></a>
                <a href="https://linkedin.com/in/alaminxab" target="_blank"><p>LinkedIn</p></a>
                <a href="https://github.com/excaliose777" target="_blank"><p>GitHub</p></a>
                <a href="https://excaliose.hashnode.dev" target="_blank"><p>Blog</p></a>
            </div>
            <div className={styles.footer_links}>
                <h4>More</h4>
                <a href='#Mint'><p>Mint ΞXC</p></a>
                <p>Stake ΞXC NFT</p>
                <p>NFT Marketplace</p>
                <p>Contact</p>
            </div>
            
        </div>
        <div className={styles.copyright}>
            <p>@2022 Made by Excaliose. All rights reserved.</p>
        </div>
    </>
  )
}

export default Footer