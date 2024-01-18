import Router from "./Components/Router";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { DarkThemeToggle, Flowbite } from "flowbite-react";
function App() {
  localStorage.setItem("color-theme", "dark");
  return (
    <>
      <Flowbite>
        <DarkThemeToggle />
        <Router />
      </Flowbite>
    </>
  );
}
export default App;
