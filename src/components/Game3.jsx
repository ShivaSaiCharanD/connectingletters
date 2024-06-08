import React, { useEffect, useRef, useState } from "react";
import {
  Application,
  Assets,
  Sprite,
  Text,
  TextStyle,
  Graphics,
} from "pixi.js";
import data1 from "../cordinates.json";
import wordsArray from "../words.json";
import confetti from "canvas-confetti";
import Popover from 'bootstrap/js/dist/popover';

const current = new Date();
const start = current.getTime();
export default function Game3() {
  const appRef = useRef(null);
  // const [stack, setStack] = useState([]);
  const stack = [];
  const [tries, setTries] = useState(0);
  const [show, setShow] = useState(1);
  const [counter, setCounter] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [allLevelsCompleted, setAllLevelsCompleted] = useState(false);
  const words = wordsArray[`session1`][`item${show}`];
  const instruction = new Audio("/instructions.wav");
  useEffect(() => {
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new Popover(popoverTriggerEl);
    });
    return () => {
      popoverList.forEach(popover => popover.dispose());
    };
  }, []);

  const handleNext = () => {
    setTries(0);
    setCounter(0);
    setShow((show) => show + 1);
    if (show === 2 && counter === 5) {
      const end = new Date().getTime();
      const time = (end - start) / 1000;
      setTotalTime(time);
      setAllLevelsCompleted(true);
    }
  };
  useEffect(() => {
    (async () => {
      const app = new Application();
      appRef.current = app;
      

      let screenSize = {};
      if (window.innerHeight < window.innerWidth) {
        screenSize = {
          width: window.innerHeight * (4 / 3),
          height: window.innerHeight * 0.8,
        };
      } else {
        screenSize = {
          width: window.innerWidth * 0.9,
          height: window.innerWidth * (3 / 4) * 0.8,
        };
      }
      await app.init({
        background: "#ffffff",
        resolution: window.devicePixelRatio || 1, // Use device pixel ratio for better quality
        autoDensity: true,
        antialias: true,
        canvas: document.getElementById("board"),
        ...screenSize,
      });

      app.renderer.resize(screenSize.width, screenSize.height);

      const texture = await Assets.load(`/template${show}.jpg`);

      let scalingFactor = 1;
      if (window.innerHeight < window.innerWidth)
        scalingFactor = (app.screen.height * 0.9) / texture.frame.height;
      else scalingFactor = (app.screen.width * 0.8) / texture.frame.width;

      const sprite = new Sprite(texture);
      sprite.scale = scalingFactor;
      const Padding = {
        x: (app.screen.width - sprite.width) / 2,
        y: (app.screen.height - sprite.height) / 2,
      };
      sprite.x = Padding.x;
      sprite.y = Padding.y;

      app.stage.addChild(sprite);

      const voice = (letter) => {
        var msg = new SpeechSynthesisUtterance(letter);
        window.speechSynthesis.speak(msg);
      }
      for (let i = 0; i < 5; i++) {
        const leftLetter = words[i][0];
        const rightLetter = words[i][1];

        const leftText = new Text({
          text: leftLetter,
          style: new TextStyle({
            fontFamily: "Arial",
            fontSize: 50 * scalingFactor,
            fill: "#000",
            align: "center",
          }),
        });

        const rightText = new Text({
          text: rightLetter,
          style: new TextStyle({
            fontFamily: "Arial",
            fontSize: 50 * scalingFactor,
            fill: "#000",
            align: "center",
          }),
        });

        const xLeft =
          (data1[`template${show}`][i + 1].left.x - 10) * scalingFactor +
          Padding.x;
        const yLeft =
          data1[`template${show}`][i + 1].left.y * scalingFactor + Padding.y;
        const xRight =
          (data1[`template${show}`][i + 1].right.x + 10) * scalingFactor +
          Padding.x;
        const yRight =
          data1[`template${show}`][i + 1].right.y * scalingFactor + Padding.y;

        const circleLeft = new Graphics()
          .circle(xLeft, yLeft, 40 * scalingFactor)
          .fill("#FFF")
          .stroke({ color: "#000", width: 2 });

        const circleRight = new Graphics()
          .circle(xRight, yRight, 40 * scalingFactor)
          .fill("#FFF")
          .stroke({ color: "#000", width: 2 });
        circleLeft.index = i;
        circleRight.index = i;
        circleLeft.display = 0;
        circleRight.display = 1;
        leftText.x = xLeft;
        leftText.y = yLeft;
        // leftText._anchor = 0;
        leftText.anchor = 0.5;

        rightText.x = xRight;
        rightText.y = yRight;
        rightText.anchor = 0.5;

        circleLeft.interactive = true;
        circleRight.interactive = true;

        circleLeft.on("pointerdown", () => {
          handleclick(circleLeft);
          voice(leftLetter);
        });
        circleRight.on("pointerdown", () => {
          handleclick(circleRight);
          voice(rightLetter);
        });

        app.stage.addChild(circleLeft);
        app.stage.addChild(circleRight);
        app.stage.addChild(leftText);
        app.stage.addChild(rightText);
      }
      const handleclick = (Graphics) => {
        stack.push(Graphics);
        if (stack.length === 1) {
          if (Graphics.display !== 0) {
            Graphics.tint = "FF0000"
            stack.pop()
            resetColor(Graphics)
            setTries((tries)=>tries+1);
            return false;
          }
          Graphics.tint = "#FFFF00";
        }

        else if (Graphics.display !== stack[stack.length - 2].display + 1 || stack[stack.length - 2].index !== Graphics.index) {
          while (stack.length !== 0) {
            const elem = stack.pop();
            resetColor(elem);
            elem.tint = "#FF0000";
            elem.interactive = false;
            setTries((tries)=>tries+1);
          }
        }
        else if (stack.length === words[Graphics.index].length) {
          confetti({
            particleCount: 300,
            spread: 90,
            decay: 0.95,
            scalar: 1.5,
            ticks: 150,
            origin: {
              y: 0.9,
            },
          });
          while (stack.length !== 0) {
            const elem = stack.pop();
            elem.interactive = false;
            elem.tint = "#00FF00";
          }
          setCounter((counter) => counter + 1);
          console.log(counter);
          return true;

        } else {
          stack.pop();
          return false;
        }
      };
      const resetColor = (Graphics) => {
        setTimeout(() => {
          Graphics.tint = undefined;
          Graphics.interactive = true;
        }, 800);
      };
    })();
  }, [show]);

  return (
    <div>
      {/* <h1>Connect the letters to form a word</h1>
       */}

      <div
        id="pixi-container"
        className="d-flex flex-column"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "98vh",
        }}
      >
        {allLevelsCompleted && counter===5 ? (
          <div>
            <h1>Game Completed</h1>
            <h2>Total Time: {totalTime} seconds</h2>
          </div>
        ) :
        <>
        <div className="d-flex justify-content-around w-100">
          <b className="fs-4" style={{ color: "green" }}>Correct {counter}</b>
          <b className="fs-4">Level {show}</b>
        </div>
        <div className="d-flex justify-content-around w-100">
          <div className="d-flex justify-content-start">
          <b className="fs-4" style={{ color: "red" }}>Tries {tries}</b>
          </div>
          <div className="d-flex justify-content-end">
          <button tabindex="0" className="btn" data-bs-toggle="popover" data-bs-trigger="focus" title="Instructions" data-bs-content="Click letters from left to right following the path"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={35} height={35} strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg></button>
          <button className="btn"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={35} height={35} strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={()=>instruction.play()}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
          </svg>
          </button>

          </div>
        </div>
        <canvas id="board" className="rounded-5"></canvas>

        <div>
          {counter === 5 && show !== 3 ? (
            <button className="btn btn-dark m-2" onClick={handleNext}>
              {" "}
              Next
            </button>
          ) : null}
        </div>
        </>}
      </div>
    </div>
  );
}