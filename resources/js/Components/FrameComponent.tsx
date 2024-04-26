import { ComponentInstance } from "@/types";
import { useState } from "react";
import { position } from "@/types";

interface FrameComponentProps {
    dragStart: position
    updateInstance: (id: string, updatedInstance: ComponentInstance) => void
    instance: ComponentInstance
    setDragStart: (x: position) => void
    setCurrentClassesComponentFunction: (x: string) => void

}

const FrameComponent: React.FC<FrameComponentProps> = (props) => {
    const [SizeStart, setSizeStart] = useState({ width: 0, height: 0 });
    let resizeDirection = ""

    const handleResize = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        let newWidth = props.instance.size.width;
        let newHeight = props.instance.size.height;
        let newX = props.instance.position.x;
        let newY = props.instance.position.y;
        switch (resizeDirection) {
            case "right":
                newWidth = SizeStart.width + (event.clientX - props.dragStart.x);
                // alert("oke")
                break;
            case "bottom":
                newHeight = SizeStart.height + (event.clientY - props.dragStart.y);

                break;
            case "left":
                newWidth = SizeStart.width - (event.clientX - props.dragStart.x);
                // setPosition({ x: position.x - (props.dragStart.x - event.clientX), y: position.y });
                newX = newX - (props.dragStart.x - event.clientX)
                break;
            case "top":
                newHeight = SizeStart.height - (event.clientY - props.dragStart.y);
                // setPosition({ x: position.x, y: position.y - (props.dragStart.y - event.clientY) });
                newY = newY - (props.dragStart.y - event.clientY)
                break;
        }
        //
        props.instance.position = { x: newX, y: newY };
        props.instance.size = { width: newWidth, height: newHeight };
        // updateInstance(currentIDComponent, newInstance, textInstances, '')
        props.setDragStart({ x: event.clientX, y: event.clientY })
        return;
    };

    const handleResizeEnd = () => {
        // setResizeDirection("");
        resizeDirection = "";
        window.removeEventListener("mousemove", handleResize);
        window.removeEventListener("mouseup", handleResizeEnd);
    };


    const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>, direction: string) => {
        event.preventDefault();
        event.stopPropagation();
        // Lưu vị trí chuột khi bắt đầu thay đổi kích thước
        props.setDragStart({ x: event.clientX, y: event.clientY });
        //Tim instance
        setSizeStart({ width: props.instance.size.width, height: props.instance.size.height });
        resizeDirection = direction;
        // setCurrentIDComponent((event.target as HTMLDivElement).id.split(direction)[1])
        window.addEventListener("mousemove", handleResize);
        window.addEventListener("mouseup", handleResizeEnd);
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {

        event.dataTransfer.setData("text/plain", "component");
        event.dataTransfer.setData("Id", (event.target as HTMLDivElement).id);
        // event.dataTransfer.setData("Id", event.target);
        props.setCurrentClassesComponentFunction((event.target as HTMLDivElement).getAttribute("class") || "");
        props.instance.isFocus = false;
        props.updateInstance((event.target as HTMLDivElement).id, props.instance)
        props.setDragStart({ x: event.clientX, y: event.clientY });
    };
    return (
        <div
            id={props.instance.id}
            className="absolute border border-gray-400/20 cursor-move p-2 hover:border-2 hover:border-gray-400 rounded"
            style={{
                width: props.instance.size.width,
                height: props.instance.size.height,
                left: props.instance.position.x,
                top: props.instance.position.y,
            }}
            draggable="true"
            onDragStart={handleDragStart}
            onFocus={(event) => {
                props.instance.isFocus = true;
                props.updateInstance(props.instance.id, props.instance)
            }}
            onBlur={(event) => {
                props.instance.isFocus = false;
                props.updateInstance(props.instance.id, props.instance)

            }}
            tabIndex={0}
        >
            {props.instance.isFocus &&
                <div
                    id={'menu' + props.instance.id}
                    className=" absolute w-16 h-4 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ top: "0", right: "0px", transform: "translateY(-120%)" }}
                    onMouseDown={(e) => handleResizeStart(e, "left")}
                    onMouseMove={(e) => resizeDirection === "left" ? handleResize : undefined}
                    onMouseUp={handleResizeEnd}
                >
                    <ul>
                        <li>

                        </li>
                    </ul>
                </div>
            }

            {props.instance.isFocus &&
                <div
                    id={'left' + props.instance.id}
                    className=" absolute w-1 h-4 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ top: "50%", left: "-2px", transform: "translateY(-50%)" }}
                    onMouseDown={(e) => handleResizeStart(e, "left")}
                    onMouseMove={(e) => resizeDirection === "left" ? handleResize : undefined}
                    onMouseUp={handleResizeEnd}
                />
            }
            {props.instance.isFocus &&
                <div
                    id={'top' + props.instance.id}
                    className=" absolute w-4 h-1 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ top: "-2px", left: "50%", transform: "translateX(-50%)" }}
                    onMouseDown={(e) => handleResizeStart(e, "top")}
                    onMouseMove={(e) => resizeDirection === "top" ? handleResize : undefined}
                    onMouseUp={handleResizeEnd}
                />
            }
            {props.instance.isFocus &&
                <div
                    id={'bottom' + props.instance.id}
                    className=" absolute w-4 h-1 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ bottom: "-2px", left: "50%", transform: "translateX(-50%)" }}
                    onMouseDown={(e) => handleResizeStart(e, "bottom")}
                    onMouseMove={(e) => resizeDirection === "bottom" ? handleResize : undefined}
                    onMouseUp={handleResizeEnd}
                />

            }
            {props.instance.isFocus &&
                <div
                    id={'right' + props.instance.id}
                    className=" absolute w-1 h-4 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ top: "50%", right: "-2px", transform: "translateY(-50%)" }}
                    onMouseDown={(e) => handleResizeStart(e, "right")}
                    onMouseMove={(e) => resizeDirection === "right" ? undefined : {
                        handleResize
                    }}
                    onMouseUp={handleResizeEnd}
                />
            }
        </div>
    );
}

export default FrameComponent;