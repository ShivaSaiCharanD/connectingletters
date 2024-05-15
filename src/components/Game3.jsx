import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import data from '../cordinates.json';
import data1 from '../newcor.json';
import confetti from 'canvas-confetti';


export default function Game3() {
    const appRef = useRef(null);
    const [stack, setStack] = useState([]);
    const words = ['at', 'it', 'to', 'me', 'go'];
    useEffect(() => {
        (async () => {
            const app = new PIXI.Application();
            appRef.current = app;
            await app.init({ background: "#000", width: 1270, height: 720, antialias: true, view: document.getElementById('board') })
            const texture = await PIXI.Assets.load('threads.jpg');

            const sprite = new PIXI.Sprite(texture);
            sprite.scale.x = 2;
            sprite.scale.y = 1.5;
            sprite.x = app.screen.width / 2;
            sprite.y = app.screen.height / 2;
            sprite.anchor.set(0.5, 0.5);
            app.stage.addChild(sprite);

            const main_text = new PIXI.Text({
                text: 'Connect the letters to form a word',
                style: new PIXI.TextStyle({
                    fill:"#FFF"
                })
            });
            const wrong_right = new PIXI.Text( {
                text: ' ',
                
                style: new PIXI.TextStyle({
                  fontFamily: 'Arial',
                  fontSize: 30,
                  fill: "#D2042D", // Text color: white 
                  align: 'center',
                }),
              });
            main_text.x = app.screen.width / 4;
            main_text.y = 50;
            // main_text.anchor = 0.5;
            app.stage.addChild(main_text);
            wrong_right.x = app.screen.width / 4;
            wrong_right.y = 20;
            app.stage.addChild(wrong_right);

            for (let index = 0; index < data.left.length; index++) {
                const leftLetter = words[index][0];
                const rightLetter = words[index][1];

                const leftText = new PIXI.Text( {
                    text: leftLetter,
                    style : new PIXI.TextStyle({
                        fontFamily: 'Arial',
                    fontSize: 40,
                    fill: "#000",
                    align: 'center'
                    })
                    
                });

                const rightText = new PIXI.Text( {
                    text: rightLetter,
                    style : new PIXI.TextStyle({
                        fontFamily: 'Arial',
                    fontSize: 40,
                    fill: "#000",
                    align: 'center'
                    })
                });

                // const xLeft = data.left[index].x * 2 + (1280 - 1000) / 2 - 20;
                // const yLeft = data.left[index].y * 1.5 + (720 - 338 * 1.5) / 2 + 10;
                // const xRight = data.right[index].x * 2 + (1280 - 1000) / 2 + 20;
                // const yRight = data.right[index].y * 1.5 + (720 - 338 * 1.5) / 2 - 10;

                const xLeft = data1[index+1].left.x*2 + (1280 - 1000) / 2 - 20;
                const yLeft = data1[index+1].left.y * 1.5 + (720 - 338 * 1.5) / 2 + 10;
                const xRight = data1[index+1].right.x * 2 + (1280 - 1000) / 2 + 20;
                const yRight = data1[index+1].right.y * 1.5 + (720 - 338 * 1.5) / 2 + 10;

                const circleLeft = new PIXI.Graphics()
                    .circle(xLeft, yLeft, 30)
                    .fill('#FFF')
                    .stroke({ color: '#000', width: 2 });

                const circleRight = new PIXI.Graphics()
                    .circle(xRight, yRight, 30)
                    .fill('#FFF')
                    .stroke({ color: '#000', width: 2 });

                leftText.x = xLeft - 10;
                leftText.y = yLeft - 20;

                rightText.x = xRight - 10;
                rightText.y = yRight - 20;

                circleLeft.interactive = true;
                circleRight.interactive = true;

                circleLeft.on('pointerdown', () => {
                    let val = handleClick(leftLetter,index,leftText,circleLeft);
                     if(val){
                        circleLeft.tint = 0x33ff33
                    }else if(stack.length === 0){
                        circleLeft.tint = undefined;
                    }
                });
                circleRight.on('pointerdown', () => {
                    let val =  handleClick(rightLetter,index , rightText ,circleRight);
                    if(val){
                        circleRight.tint = 0x33ff33
                        }
                    else if(stack.length === 0){
                        circleRight.tint = undefined;
                    }});

                app.stage.addChild(circleLeft);
                app.stage.addChild(circleRight);
                app.stage.addChild(leftText);
                app.stage.addChild(rightText);
            }

            const handleClick = (letter, index,Text,Graphics) => {
                console.log("Clicked " + letter + " at index " + index);
                
                // Check if the stack is empty or the index of the new letter is equal to the index of the top element
                if (stack.length === 0 || ((index === stack[stack.length - 1].index)  && (letter !== stack[0].letter))) {
                    // Push the new letter and its index to the stack
                    stack.push({ letter, index ,Text ,Graphics });
                    if(stack.length===2){
                        confetti({               
                            particleCount: 600,
                            spread: 90,
                            decay: 0.95,
                            scalar: 1.5,
                            ticks: 150,
                            origin: { y: 0.9 },
                            
                        });
                        stack[1].Text.text = "";
                        stack.pop();
                        stack[0].Text.text = "";

                        stack.pop();
                        console.log("correct");
                        wrong_right.style.fill = "#00FF00";
                        wrong_right.text = "correct!!";
                        setTimeout(() => {
                            wrong_right.text = "";
                        }, 2000);
                        // console.log(stack);
                        // setStack([]);
                        
                        // stack[-1].text = "";
                        
                        
                    }
                    return true;
           
                } else {
                    console.log("Incorrect order!");
                    // Clear the stack if the order is incorrect
                        console.log(stack);
                        wrong_right.style.fill = "#D2042D";
                        wrong_right.text = "Incorrect order!";
                        setTimeout(() => {
                            wrong_right.text = "";
                        }, 2000);
                    // setStack([]);
                    stack[0].Graphics.tint = undefined;
                    stack.pop();
                    return false;
                }
            };
        })();
       
    }, [])

    
    
    
    
    
    

    return (
        <div>
            <div id="pixi-container">
                <canvas id='board'></canvas>
            </div>
        </div>
    )
}