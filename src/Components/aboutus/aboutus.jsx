import React from "react";
import "./aboutus.css";
import aprhem from "../Assets/aphremII.png";
import baselios from "../Assets/baselios.png";
import Usernavbar from "../user-navbar/userNavbar";

const Aboutus = () => {
  return (
    <div className="aboutus-container">
      <Usernavbar />
      <div className="aboutus-grid">
        <div className="aboutus one">
          <img src={aprhem} alt="Moran Mor Ignatius" />
          <div className="aboutus-content">
            <div className="aboutus-name">Moran Mor Ignatius Aphrem II</div>
            Moran Mor Ignatius Aphrem II is the current Patriarch of Antioch and
            the Supreme Head of the Universal Syriac Orthodox Church. He was
            enthroned on May 29, 2014, succeeding Patriarch Ignatius Zakka I
            Iwas.
            <button className="aboutus-know-more">
              <a href="https://en.wikipedia.org/wiki/Ignatius_Aphrem_II">
                Know more
              </a>
            </button>
          </div>
        </div>
        <div className="aboutus two">
          <div className="aboutus-content">
            <div className="aboutus-name">Moran Mor Ignatius Aphrem II</div>
            Moran Mor Ignatius Aphrem II is the current Patriarch of Antioch and
            the Supreme Head of the Universal Syriac Orthodox Church. He was
            enthroned on May 29, 2014, succeeding Patriarch Ignatius Zakka I
            Iwas.
            <button className="aboutus-know-more">
              <a href="https://en.wikipedia.org/wiki/Ignatius_Aphrem_II" >
                Know more
              </a>
            </button>
          </div>
          <img src={aprhem} alt="Moran Mor Ignatius" />
        </div>
        <div className="aboutus three">
          <img src={baselios} alt="Moran Mor Ignatius" />
          <div className="aboutus-content">
            <div className="aboutus-name">Baselios Thomas I</div>
            Baselios Thomas I (born 22 July 1929) is a Syriac Orthodox
            Catholicos of India (Maphrian) and head of the Jacobite Syrian
            Christian Church, the Syriac Orthodox Church in India. He was
            enthroned on 26 July 2002 by Syriac Orthodox Patriarch Ignatius
            Zakka I Iwas, Patriarch of Antioch and All the East in a ceremony
            held in Damascus, Syria.
            <button className="aboutus-know-more">
              <a href="https://en.wikipedia.org/wiki/Baselios_Thomas_I" >
                Know more
              </a>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
