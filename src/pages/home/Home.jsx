
import backgroundImage from "../../assets/img/Imagen-Final.png";
import "../../Styles/Home.scss";

const Home = () => {
  return (
    <>
      <div className="home-container">
        <img src={backgroundImage} alt="Main" className="imagen" />
      </div>
    </>
  );
};

export default Home;
