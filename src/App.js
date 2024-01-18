import Router from "./Components/Router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  localStorage.setItem("color-theme", "light");
  return (
    <>
      <Router />
    </>
  );
}
export default App;
