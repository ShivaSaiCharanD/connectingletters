import React, { useEffect, useRef, useState } from "react";
import { Application, Assets, Sprite, Text} from "pixi.js";
import confetti from "canvas-confetti";
import data from "../levels.json";
import "../Game2.css"; // Import the CSS file

export default function Game2() {
  const appRef = useRef(null);
  const [level, setLevel] = useState(0);
  const [tries, setTries] = useState(0);
  // const maxLevel = data.levels.level.length;
  useEffect(() => {
    const app = new Application();
    const current = new Date();
    const start = current.getTime(); 
    (async  () => {
      await app.init({
        width: window.innerWidth - 10,
        height: window.innerHeight - 180,
        backgroundColor: "ffffff",
        view: document.getElementById('board')
      });
      document.body.appendChild(app.canvas);
      appRef.current = app;
      const paths = await Assets.load(data.levels.Paths[0]);

      const path = new Sprite(paths);
      const letters = data.levels.letters[level];
      const words = data.levels.words[level];

      letters.forEach((element) => {
        const text = new Text({ text: element.key, fill: "#000000", fontSize: 24 });
        text.x = element.value[0];
        text.y = element.value[1];
        text.interactive = true;
        text.on("pointerdown", () => Clicked(element.key, element.pos, element.id,text));
        app.stage.addChild(text);
      });
      app.stage.addChild(path);
      path.x = app.screen.width / 3;
      path.y = app.screen.height / 4;

      const Invalid = new Text({ text: "Invalid", fill: "#000000", fontSize: 36 });
      Invalid.x = 100;
      Invalid.y = 100;
      Invalid.visible = false;

      const Correct = new Text({ text: "Correct", fill: "#000000", fontSize: 36 });
      Correct.x = 100;
      Correct.y = 100;
      Correct.visible = false;

      app.stage.addChild(Correct);
      app.stage.addChild(Invalid);

      let word = "";
      let clicks = { left: false, mid: false, right: false };
      let tries = 0;
      let wid = 0;
      let idSet = new Set();
      function Clicked(key, pos, id, text) {
        if(wid===0){
          wid = id;
        }
        if (wid !== null && wid !== id) {
          console.log("Invalid click: letters must have the same id");
          word = "";
          clicks = { left: false, mid: false, right: false };
          wid = null;
          return;
        }
        if (pos === "mid" && !clicks.mid) {
          word += key;
          clicks.mid = true;
          text.style.fill = "#ffbf00";
        } else if (pos === "left" && !clicks.left) {
          word = key + word;
          clicks.left = true;
          text.style.fill = "#ffbf00";
        } else if (pos === "right" && !clicks.right) {
          word += key;
          clicks.right = true;
          text.style.fill = "#ffbf00";
        } else {
          console.log("Invalid click");
          showInvalidMessage();
          return;
        }

        wid = id;

        if (word.length === 3) {
          validateWord(word);
          word = "";
          clicks = { left: false, mid: false, right: false };
          wid = null;
        }
      }

      function validateWord(word) {
        if (words.includes(word)) {
          console.log("Correct");
          showCorrectMessage();
          idSet.add(wid);
          setTries(prevTries => prevTries + 1);
          confetti({ particleCount: 200, spread: 200 });
        } else {
          console.log("Invalid");
          showInvalidMessage();
        }

        if (idSet.size === 5) {
          console.log("Game Over");
          const end = new Date().getTime();
          console.log("Time taken: " + (end - start) / 1000 + " seconds");
          confetti();
          idSet.clear();
        } else {
          console.log("Continue playing");
        }
      }

      function showCorrectMessage() {
        Correct.visible = true;
        setTimeout(() => { Correct.visible = false; }, 2000);
      }

      function showInvalidMessage() {
        Invalid.visible = true;
        setTimeout(() => { Invalid.visible = false; }, 2000);
      }
      window.tries = tries;
    })();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true });
      }
    };
  }, [level]);

  return (
    <div>
      <div id="pixi-container">
        <canvas id='board'></canvas>
      </div>
    {level < 100 && (
      <button type="button" onClick={() => setLevel(level+1)}>
        Next Stage
      </button>
      )}
      <p>Stage: {level+1}</p>
      <p>Tries:{tries}</p>
    </div>
  );
}
