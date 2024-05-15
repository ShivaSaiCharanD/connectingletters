import React from 'react';
import { useEffect } from 'react';
import * as PIXI from 'pixi.js';



export default function Game1() {
  useEffect(() => {
    start();
  }, []);
  async function start(){
    const app = new PIXI.Application();

  console.log("Hello1")
  app.init({ 'resizeTo': window, backgroundColor: 'white' });

  const texture = await PIXI.Assets.load('paths.jpeg');

  const paths = new PIXI.Sprite(texture);

  // paths.x = app.screen.width / 2;
  // paths.y = app.screen.height / 2;
  paths.x = 950;
  paths.y = 450;

  paths.width = 900;

  const text = new PIXI.Text('a', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xff1010,
    align: 'center',
  });

  text.x = 50;
  text.y = 50;

  app.stage.addChild(text);

  paths.anchor.x = 0.5;
  paths.anchor.y = 0.5;


  app.stage.addChild(paths);

  document.body.appendChild(app.canvas);
  }
  
  return (
    <div></div>
  )
}
