import { useState } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";

const darkModeState = atom({
  key: "darkMode",
  default: false,
});

const DarkModeSwitch = () => {
  const [darkMode, setDarkMode] = useRecoilState(darkModeState);

  return (
    <input
      type="checkbox"
      checked={darkMode}
      onChange={(e) => setDarkMode(e.currentTarget.checked)}
    />
  );
};

const Button = () => {
  const darkMode = useRecoilValue(darkModeState);

  return (
    <button
      style={{
        padding: 4,
        borderRadius: 6,
        backgroundColor: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      }}
    >
      My UI Button
    </button>
  );
};

export const Atoms = () => {
  return (
    <div>
      <div>
        <DarkModeSwitch />
      </div>
      <div>
        <Button />
      </div>
    </div>
  );
};
