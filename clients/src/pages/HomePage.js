//import { Router } from "react-router-dom";
import Navbar from "../components/singup/Navbar.js";
import Landing from "../components/singup/Landing.js";
import Footer from "../components/singup/Footer.js";
import Key from "../components/singup/Key_Feature.js";
import TeachStack from "../components/singup/Teach.js";

function HomePage() {
  return (
    <>
      <Navbar />
      <Landing />
      <Key />
      <TeachStack />
      <Footer />
    </>
  );
}
export default HomePage;
