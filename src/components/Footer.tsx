import { TwitterLogoIcon, LinkedInLogoIcon, InstagramLogoIcon } from "@radix-ui/react-icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="col">
          <div className="brand" style={{ display: "inline-block", marginBottom: 8 }}>LUXE WEAR</div>
          <div className="muted" style={{ marginBottom: 12 }}>AI Agent bán hàng thời trang</div>

          <div className="contact-line"><span className="contact-icn" aria-hidden>📍</span> 28-11, Q Sentral, Jalan Stesen Sentral 2, 50470 Kuala Lumpur (Asia Pacific Center)</div>
          <div className="contact-line"><span className="contact-icn" aria-hidden>✉️</span> leads@luxewear.ai</div>

          <div className="socials">
            <a aria-label="Twitter" href="#"><TwitterLogoIcon /></a>
            <a aria-label="Facebook" href="#"><LinkedInLogoIcon /></a>
            <a aria-label="Instagram" href="#"><InstagramLogoIcon /></a>
          </div>
        </div>

        <div className="col">
          <div className="footer-title">Products</div>
          <ul className="footer-list">
            <li><a href="#">SimpleConnect</a></li>
            <li><a href="#">Call Center</a></li>
            <li><a href="#">Omnichannel</a></li>
            <li><a href="#">Tickets</a></li>
            <li><a href="#">CRM</a></li>
            <li><a href="#">Reporting</a></li>
          </ul>
        </div>

        <div className="col">
          <div className="footer-title">Resources</div>
          <ul className="footer-list">
            <li><a href="#">Blog</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Partner With Us</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer-bottom">
        <span className="muted">COPYRIGHT © {new Date().getFullYear()} LUXE WEAR AI. ALL RIGHTS RESERVED.</span>
      </div>
    </footer>
  );
}
