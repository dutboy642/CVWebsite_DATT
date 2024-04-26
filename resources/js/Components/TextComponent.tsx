import { TextComponentInstance } from "@/types";
import { useState } from "react";
import { position } from "@/types";
import ReactQuill from 'react-quill';

interface TextComponentProps {
    dragStart: position
    updateInstance: (id: string, updatedInstance: TextComponentInstance) => void
    instance: TextComponentInstance
    setDragStart: (x: position) => void
    setCurrentClassesComponentFunction: (x: string) => void
}

const TextComponent: React.FC<TextComponentProps> = (props) => {
    const [SizeStart, setSizeStart] = useState({ width: 0, height: 0 });
    let resizeDirection = ""

    const handleTextResize = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        let newWidth = props.instance.size.width;
        let newHeight = props.instance.size.height;
        let newX = props.instance.position.x;
        let newY = props.instance.position.y;
        switch (resizeDirection) {
            case "right":
                newWidth = SizeStart.width + (event.clientX - props.dragStart.x);
                break;
            case "bottom":
                newHeight = SizeStart.height + (event.clientY - props.dragStart.y);
                break;
            case "left":
                newWidth = SizeStart.width - (event.clientX - props.dragStart.x);
                newX = newX - (props.dragStart.x - event.clientX)
                break;
            case "top":
                newHeight = SizeStart.height - (event.clientY - props.dragStart.y);
                newY = newY - (props.dragStart.y - event.clientY)
                break;
        }
        props.instance.position = { x: newX, y: newY };
        props.instance.size = { width: newWidth, height: newHeight };
        props.setDragStart({ x: event.clientX, y: event.clientY })
        return;
    };

    // Function để kết thúc quá trình thay đổi kích thước

    const handleResizeTextEnd = () => {
        // setResizeDirection("");
        resizeDirection = "";
        window.removeEventListener("mousemove", handleTextResize);
        window.removeEventListener("mouseup", handleResizeTextEnd);
    };


    const handleResizeTextStart = (event: React.MouseEvent<HTMLDivElement>, direction: string) => {
        event.preventDefault();
        event.stopPropagation();
        // Lưu vị trí chuột khi bắt đầu thay đổi kích thước
        props.setDragStart({ x: event.clientX, y: event.clientY });
        //Tim instance
        setSizeStart({ width: props.instance.size.width, height: props.instance.size.height });
        resizeDirection = direction;
        // setCurrentIDComponent((event.target as HTMLDivElement).id.split(direction)[1])
        window.addEventListener("mousemove", handleTextResize);
        window.addEventListener("mouseup", handleResizeTextEnd);
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("text/plain", "component");
        event.dataTransfer.setData("Id", (event.target as HTMLDivElement).id);
        props.setCurrentClassesComponentFunction((event.target as HTMLDivElement).getAttribute("class") || "");
        props.instance.isFocus = false;
        props.updateInstance((event.target as HTMLDivElement).id, props.instance)
        props.setDragStart({ x: event.clientX, y: event.clientY });
    };

    return (
        <div
            id={props.instance.id}
            className="absolute border border-gray-400/20 cursor-move textComponent p-2 hover:border-2 hover:border-gray-400 rounded"
            style={{
                width: props.instance.size.width,
                height: props.instance.size.height,
                left: props.instance.position.x,
                top: props.instance.position.y,
            }}
            onFocus={(event) => {
                props.instance.isFocus = true;
                props.updateInstance(props.instance.id, props.instance)

            }}
            onBlur={(event) => {
                props.instance.isFocus = false;
                props.updateInstance(props.instance.id, props.instance)
            }}
            tabIndex={0}
            draggable="true"
            onDragStart={handleDragStart}
        // onMouseEnter={() => {
        // }}

        >

            <div
                className='h-full'
                onMouseDown={(e) => {
                    document.getElementById(props.instance.id)?.setAttribute("draggable", "false")
                    window.addEventListener("mouseup", () => { document.getElementById(props.instance.id)?.setAttribute("draggable", "true") });
                }
                }
            >
                <ReactQuill
                    id={'quill' + props.instance.id}
                    className='p-0 h-full'
                    value={props.instance.text}
                    onChange={(value) => {
                        props.instance.text = value;
                        props.updateInstance(props.instance.id, props.instance)
                    }}
                    // modules={{
                    //     toolbar: [
                    //         [{ header: [1, 2, false] }],
                    //         ['bold', 'italic', 'underline'],
                    //         ['image', 'code-block']
                    //     ]
                    // }}
                    theme="bubble"
                />
            </div>

            {props.instance.isFocus &&
                <div
                    id={'left' + props.instance.id}
                    className="absolute w-1 h-4 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ top: "50%", left: "-2px", transform: "translateY(-50%)" }}
                    onMouseDown={(e) => handleResizeTextStart(e, "left")}
                    onMouseMove={(e) => resizeDirection === "left" ? handleTextResize : undefined}
                    onMouseUp={handleResizeTextEnd}
                />
            }
            {props.instance.isFocus &&
                <div
                    id={'top' + props.instance.id}
                    className="absolute w-4 h-1 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ top: "-2px", left: "50%", transform: "translateX(-50%)" }}
                    onMouseDown={(e) => handleResizeTextStart(e, "top")}
                    onMouseMove={(e) => resizeDirection === "top" ? handleTextResize : undefined}
                    onMouseUp={handleResizeTextEnd}
                />
            }
            {props.instance.isFocus &&
                <div
                    id={'bottom' + props.instance.id}
                    className="absolute w-4 h-1 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ bottom: "-2px", left: "50%", transform: "translateX(-50%)" }}
                    onMouseDown={(e) => handleResizeTextStart(e, "bottom")}
                    onMouseMove={(e) => resizeDirection === "bottom" ? handleTextResize : undefined}
                    onMouseUp={handleResizeTextEnd}
                />
            }
            {props.instance.isFocus &&
                <div
                    id={'right' + props.instance.id}
                    className="absolute w-1 h-4 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ top: "50%", right: "-2px", transform: "translateY(-50%)" }}
                    onMouseDown={(e) => handleResizeTextStart(e, "right")}
                    onMouseMove={(e) => resizeDirection === "right" ? undefined : {
                        handleTextResize
                    }}
                    onMouseUp={handleResizeTextEnd}
                />
            }
        </div>)
}

export default TextComponent;