import React, { useEffect, useRef } from "react";
import { Application, Assets, Sprite, Text } from "pixi.js";
import data from "../levels.json";

export default function Game2() {
  const appRef = useRef(null);

  useEffect(() => {
    const app = new Application();

    (async () => {
      await app.init({
        width: window.innerWidth - 10,
        height: window.innerHeight - 180,
        backgroundColor: "ffffff",
      });
      document.body.appendChild(app.canvas);
      appRef.current = app;

      const paths = await Assets.load("paths2.png");
      const path = new Sprite(paths);
      const letters = data.levels.letters[0];
    //   [
    //     { key: "a", value: [825, 220], pos: "mid" },
    //     { key: "l", value: [820, 435], pos: "mid" },
    //     { key: "a", value: [905, 350], pos: "mid" },
    //     { key: "i", value: [1062, 255], pos: "mid" },
    //     { key: "e", value: [1020, 500], pos: "mid" },
    //     { key: "n", value: [620, 210], pos: "left" },
    //     { key: "c", value: [620, 295], pos: "left" },
    //     { key: "a", value: [620, 380], pos: "left" },
    //     { key: "f", value: [620, 460], pos: "left" },
    //     { key: "p", value: [620, 550], pos: "left" },
    //     { key: "p", value: [1260, 230], pos: "right" },
    //     { key: "l", value: [1260, 305], pos: "right" },
    //     { key: "t", value: [1260, 385], pos: "right" },
    //     { key: "n", value: [1260, 475], pos: "right" },
    //     { key: "t", value: [1260, 555], pos: "right" },
    //   ];
      const words = data.levels.words[0];
    //   ["nap", "cat", "all", "fit", "pen"];
      letters.forEach((element) => {
        const text = new Text({
          text: element.key,
        });
        text.x = element.value[0];
        text.y = element.value[1];
        text.interactive = true;
        text.on("pointerdown", () => Clicked(element.key, element.pos));
        app.stage.addChild(text);
      });
      app.stage.addChild(path);
      path.x = app.screen.width / 3;
      path.y = app.screen.height / 4;

      const Invalid = new Text({
        text: "Invalid",
      });
      Invalid.x = 100;
      Invalid.y = 100;
      Invalid.visible = false;

      const Correct = new Text({
        text: "Correct",
      });
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
          // PIXI.sound.play('Tryagain.mp3');
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
    
    };
  }, []);

  return <canvas />;
}
