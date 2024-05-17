import React, { useEffect, useRef, useState } from "react";
import { Application, Assets, Sprite, Text } from "pixi.js";
import data from "../levels.json";
import "../Game2.css"; // Import the CSS file

export default function Game2() {
  const appRef = useRef(null);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const app = new Application();
    (async () => {
      await app.init({
        width: window.innerWidth - 10,
        height: window.innerHeight - 180,
        backgroundColor: "ffffff",
        view: document.getElementById('board')
      });
      document.body.appendChild(app.canvas);
      appRef.current = app;

      const paths = await Assets.load("paths2.png");

      const path = new Sprite(paths);
      const letters = data.levels.letters[level];
      const words = data.levels.words[level];

      letters.forEach((element) => {
        const text = new Text({ text: element.key, fill: "#000000", fontSize: 24 });
        text.x = element.value[0];
        text.y = element.value[1];
        text.interactive = true;
        text.on("pointerdown", () => Clicked(element.key, element.pos));
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
      let clicks = [false, false, false];

      function Clicked(key, pos) {
        if (word.length === 3) {
          word = "";
          clicks = [false, false, false];
        }
        if (pos === "mid" && !clicks[1]) {
          word = word + key;
          clicks[1] = true;
          console.log(word);
          validation(word);
        } else if (pos === "left" && !clicks[0]) {
          word = key + word;
          clicks[0] = true;
          console.log(word);
          validation(word);
        } else if (pos === "right" && !clicks[2]) {
          word = word + key;
          clicks[2] = true;
          console.log(word);
          validation(word);
        } else {
          word = "";
          clicks = [false, false, false];
          console.log("Invalid click");
          Invalid.visible = true;
          setTimeout(() => {
            Invalid.visible = false;
          }, 4000);
        }
      }

      function validation(word) {
        if (words.includes(word) && word.length === 3) {
          console.log("Correct");
          Correct.visible = true;
          setTimeout(() => {
            Correct.visible = false;
          }, 4000);
        }
      }
    })();

    return () => {
      if (appRef.current > 1) {
        appRef.current.destroy(true, { children: true });
        document.body.removeChild(appRef.current.view);
      }
    };
  }, [level]);

  return (
    <div>
      <div id="pixi-container">
        <canvas id='board'></canvas>
      </div>
      <button type="button" onClick={() => setLevel(level + 1)}>
        Next Level
      </button>
    </div>
  );
}
