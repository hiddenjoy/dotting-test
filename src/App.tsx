import { useEffect, useRef, useState } from "react";
import {
  CanvasHoverPixelChangeHandler,
  Dotting,
  DottingRef,
  useBrush,
  useData,
  useDotting,
  useGrids,
  useHandlers,
} from "dotting";

import { PixelModifyItem } from "dotting";
import bdata from "./data/bdata.json";
import kdata from "./data/kdata.json";
import hdata from "./data/hdata.json";

export const CreateEmptySquareData = (
  size: number
): Array<Array<PixelModifyItem>> => {
  const data: Array<Array<PixelModifyItem>> = [];
  for (let i = 0; i < size; i++) {
    const row: Array<PixelModifyItem> = [];
    for (let j = 0; j < size; j++) {
      row.push({ rowIndex: i, columnIndex: j, color: "" });
    }
    data.push(row);
  }
  return data;
};

function App() {
  const ref = useRef<DottingRef>(null);
  const { colorPixels } = useDotting(ref);
  const { indices, dimensions } = useGrids(ref);
  const {
    addHoverPixelChangeListener,
    removeHoverPixelChangeListener,
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
  } = useHandlers(ref);
  const [hoveredPixel, setHoveredPixel] = useState<{
    rowIndex: number;
    columnIndex: number;
  } | null>(null);
  const { clear } = useDotting(ref);

  useEffect(() => {
    const hoverPixelChangeListener: CanvasHoverPixelChangeHandler = (pixel) => {
      const { indices } = pixel;
      if (indices) {
        setHoveredPixel(indices);
      } else {
        setHoveredPixel(null);
      }
    };
    addHoverPixelChangeListener(hoverPixelChangeListener);
    return () => {
      removeHoverPixelChangeListener(hoverPixelChangeListener);
    };
  }, [addHoverPixelChangeListener, removeHoverPixelChangeListener]);

  useEffect(() => {
    const onCanvasClickListener = () => {
      // TASK: Make a firework effect when the user clicks on the canvas.
      // HINT1: You can use the `colorPixels` function to change the color of a pixel.
      // HINT2: You must know the boundaries of the current pixel canvas to take into considuration of the extent of the firework effect.
      // HINT3: You can use the indices and dimensions variables to get the boundaries of the current pixel canvas.
      // Check out the documentation for more information:
      // URL1: https://hunkim98.github.io/dotting/?path=/story/hooks-usedotting--page
      // URL2: http://localhost:6005/?path=/story/hooks-usegrids--page
      // Do not modify any parts other than the below.
      // Modifiy ⬇️

      if (hoveredPixel) {
        console.log(
          `You clicked on rowIndex: ${hoveredPixel.rowIndex}, columnIndex: ${hoveredPixel.columnIndex}`
        );

        const firework = []; // array for storing the pixels to be colored

        for (let x = indices.topRowIndex; x <= indices.bottomRowIndex; x++) {
          const descY = x + (hoveredPixel.columnIndex - hoveredPixel.rowIndex); // for descending diagonal
          if (
            descY >= indices.leftColumnIndex &&
            descY <= indices.rightColumnIndex // check if the pixel is within the boundaries of the canvas
          ) {
            firework.push({
              rowIndex: x,
              columnIndex: descY,
              color: "red",
            });
          }

          const ascY = -x + (hoveredPixel.columnIndex + hoveredPixel.rowIndex); // for ascending diagonal
          if (
            ascY >= indices.leftColumnIndex &&
            ascY <= indices.rightColumnIndex // check if the pixel is within the boundaries of the canvas
          ) {
            firework.push({
              rowIndex: x,
              columnIndex: ascY,
              color: "red",
            });
          }
        }

        // colorPixels(firework); // color the pixels
      }

      // Modify ⬆️
    };

    addCanvasElementEventListener("mousedown", onCanvasClickListener);

    return () => {
      removeCanvasElementEventListener("mousedown", onCanvasClickListener);
    };
  }, [
    addCanvasElementEventListener,
    removeCanvasElementEventListener,
    hoveredPixel,
    indices,
    colorPixels,
    dimensions,
  ]);

  // 2주차 과제

  // 알파벳 어레이 다운받기
  const { dataArray } = useData(ref);
  const downloadDataArray = () => {
    const aData = dataArray;
    const aDataJson = JSON.stringify(aData);
    const blob = new Blob([aDataJson], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.json";
    link.click();
  };

  // 다운받은 어레이들로 색칠하기
  const colorAlphabet = (data: any) => {
    clear();
    data.forEach((row: any, rowIndex: number) => {
      row.forEach((pixel: any, columnIndex: number) => {
        if (pixel.color) {
          colorPixels([
            {
              rowIndex: rowIndex,
              columnIndex: columnIndex,
              color: "black",
            },
          ]);
        }
      });
    });
  };

  useEffect(() => {
    const onKeyPress = (e: KeyboardEvent): void => {
      if (e.key === "k" || e.key === "K" || e.key === "ㅏ") {
        colorAlphabet(kdata);
      } else if (e.key === "h" || e.key === "H" || e.key === "ㅗ") {
        colorAlphabet(hdata);
      } else if (e.key === "b" || e.key === "B" || e.key === "ㅠ") {
        colorAlphabet(bdata);
      }
    };
    window.addEventListener("keypress", onKeyPress);
    return () => {
      window.addEventListener("keypress", onKeyPress);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#282c34",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        color: "white",
        position: "relative",
      }}
    >
      {/* {hoveredPixel && (
        <div
          style={{
            position: "absolute",
            transform: "translate(50%, 50%)",
            right: "50%",
            top: "10px",
          }}
        >
          You are hoveing rowIndex: {hoveredPixel.rowIndex}, columnIndex:{" "}
          {hoveredPixel.columnIndex}
        </div>
      )} */}
      <Dotting
        width={1000}
        height={650}
        ref={ref}
        initLayers={[{ id: "layer1", data: CreateEmptySquareData(28) }]}
      />
      <div>
        <button
          style={{
            padding: "5px 10px",
            background: "white",
            marginTop: 10,
            marginBottom: 50,
          }}
          onClick={clear}
        >
          clear
        </button>

        <button
          style={{
            padding: "5px 10px",
            background: "white",
            marginTop: 10,
            marginBottom: 50,
          }}
          onClick={downloadDataArray}
        >
          download array
        </button>
      </div>
    </div>
  );
}

export default App;
