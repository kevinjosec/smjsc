import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./homepage.css";
import Navbar from "../navbar/navbar";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaLocationDot } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
import churchLogo from "../Assets/church-logo.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const homepage = () => {
  const position = [29.284668, 48.079891];

  return (
    <div className="homepage-container">
      <div className="homepage-sub-container">
        <div className="homepage-navbar">
          <Navbar />
        </div>
        <div className="homepage-header">
          <span className="marys">St Mary's Jacobite</span>
          <br />
          <span className="church">Syrian Orthodox Church</span>
        </div>
      </div>
      <div className="join-us-container">
        <p className="service">JOIN US FOR SERVICE</p>
        <p className="timing">THURSDAYS 7:30 PM TO 9:30 PM</p>
        <p className="service-content">
          Experience a welcoming community where faith, fellowship, and
          inspiration come together. Uplift your spirit, deepen your
          understanding, and connect with others who share your journey.
        </p>
      </div>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: "400px", width: "95%", margin: "auto" }}
        scrollWheelZoom={false} // Disable scroll wheel zoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position}>
          <Popup>
            <a href="https://maps.app.goo.gl/Q4SWCVQYfg2BtJV57">
              St. Marys Jacobite Syrian Orthodox Church
            </a>
          </Popup>
        </Marker>
      </MapContainer>
      <div className="vicar-container">
        <h2 className="vicar-header">Vicar</h2>
        <div className="vicar-image"></div>
        <h3 className="vicar-name">Reverend Father Samuel</h3>
      </div>
      <br />
      <div className="main-event-container">
        <div className="main-events">
          <div className="events">
            <div className="event-image">Event Image</div>
            <div className="event-name">Annual Picnic</div>
            <div className="event-content">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </div>
          </div>
          <div className="events">
            <div className="event-image">Event Image</div>
            <div className="event-name">New Year Get Together</div>
            <div className="event-content">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </div>
          </div>
          <div className="events">
            <div className="event-image">Event Image</div>
            <div className="event-name">Harvest Festival</div>
            <div className="event-content">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </div>
          </div>
        </div>
      </div>
      <div className="belief-container">
        <div className="belief-header">WHAT WE BELIEVE SHAPES WHAT WE DO</div>
        <div className="belief-content">
          Our core beliefs guide our actions, inspiring us to serve with
          compassion, integrity, and love. Rooted in faith, we strive to make a
          positive impact in our community and beyond. By living out our values,
          we create a space where everyone feels valued and supported. Join us
          as we translate our beliefs into meaningful deeds, transforming lives
          and spreading hope.
        </div>
      </div>
      <div className="contact-container">
        <div className="logo">
          <img src={churchLogo} alt="Church Logo" className="churchLogo" />
        </div>
        <br />
        <div className="socials">
          <div className="icon-circle">
            <FaFacebookF
              size={"1.25em"}
              onClick={() => {
                window.open(
                  "https://www.facebook.com/marysjacobite.syrianchurch",
                  "_blank"
                );
              }}
            />
          </div>
          <div className="icon-circle">
            <FaPhone
              size={"1.25em"}
              onClick={() => {
                window.location.href = "tel:+96565823077";
              }}
            />
          </div>
          <div className="icon-circle">
            <MdEmail
              size={"1.25em"}
              onClick={() => {
                window.location.href = `mailto:kevinjosecheriachery@gmail.com?subject=Contacting through the website`;
              }}
            />
          </div>
          <div className="icon-circle">
            <FaLocationDot
              size={"1.25em"}
              onClick={() => {
                window.open(
                  "https://www.google.com/maps/place/St.Marys+Jacobite+Church,+Salwa,+Block+10%D8%8C+Kuwait/data=!4m2!3m1!1s0x3fcf9e282f751ee3:0x4bfcdaaaddb4a301?entry=gps&coh=192189&g_ep=CAESCjExLjEzNC4xMDQYACDXggMqSCw5NDIxMjQ5Niw5NDIwNzUwNiw5NDIwODUwNiw5NDIxNzUyMyw5NDIxODY1Myw0NzA4NzExOCw0NzA4NDM5Myw5NDIxMzIwMEICSU4%3D",
                  "_blank"
                );
              }}
            />
          </div>
        </div>
        <br/>
        <div className="contact-us"></div>
        <br />
        <div className="copyright">
          <span>
            &copy; {new Date().getFullYear()} St Marys Jacobite Syrian Orthodox
            Church. All rights reserved
          </span>
        </div>
      </div>
    </div>
  );
};

export default homepage;
