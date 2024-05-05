import { ComponentInstance } from "@/types";
import { useState } from "react";
import { position } from "@/types";
import SmallMenuComponent from "./SmallMenuComponent";

interface FrameComponentProps {
    dragStart: position
    updateInstance: (pageId: string, id: string, updatedInstance: ComponentInstance) => void
    instance: ComponentInstance
    setDragStart: (x: position) => void
    setCurrentClassesComponentFunction: (x: string) => void
    deleteInstance: (pageId: string, id: string) => void
    cloneInstance: (pageId: string, id: string) => void
    scaleValue: number
    pageId: string
    displayMenu: number
    setDisplayMenuFunction: (x: number) => void

}

const FrameComponent: React.FC<FrameComponentProps> = (props) => {
    const [SizeStart, setSizeStart] = useState({ width: 0, height: 0 });
    const [positionStart, setPositionStart] = useState({ x: 0, y: 0 });
    const [isInMenu, setIsInMenu] = useState(false);

    let resizeDirection = ""

    const setIsInMenuFunction = (x: boolean) => {
        setIsInMenu(x);
    }
    const handleResize = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        let newWidth = props.instance.size.width;
        let newHeight = props.instance.size.height;
        let newX = props.instance.position.x;
        let newY = props.instance.position.y;
        switch (resizeDirection) {
            case "right":
                newWidth = SizeStart.width + (event.clientX - props.dragStart.x) / props.scaleValue * 100;
                // alert("oke")
                break;
            case "bottom":
                newHeight = SizeStart.height + (event.clientY - props.dragStart.y) / props.scaleValue * 100;

                break;
            case "left":
                newWidth = SizeStart.width - (event.clientX - props.dragStart.x) / props.scaleValue * 100;
                // setPosition({ x: position.x - (props.dragStart.x - event.clientX), y: position.y });
                newX = positionStart.x - (props.dragStart.x - event.clientX) / props.scaleValue * 100
                break;
            case "top":
                newHeight = SizeStart.height - (event.clientY - props.dragStart.y) / props.scaleValue * 100;
                // setPosition({ x: position.x, y: position.y - (props.dragStart.y - event.clientY) });
                newY = positionStart.y - (props.dragStart.y - event.clientY) / props.scaleValue * 100
                break;
        }
        //
        props.instance.position = { x: newX, y: newY };
        props.instance.size = { width: newWidth, height: newHeight };
        props.setDragStart({ x: event.clientX, y: event.clientY })
        // props.updateInstance(props.instance.id, props.instance)

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
        setPositionStart({ x: props.instance.position.x, y: props.instance.position.y });
        resizeDirection = direction;
        // setCurrentIDComponent((event.target as HTMLDivElement).id.split(direction)[1])
        window.addEventListener("mousemove", handleResize);
        window.addEventListener("mouseup", handleResizeEnd);
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {

        event.dataTransfer.setData("text/plain", "component");
        event.dataTransfer.setData("Id", (event.target as HTMLDivElement).id);
        event.dataTransfer.setData("pageId", props.pageId);

        // event.dataTransfer.setData("Id", event.target);
        props.setDisplayMenuFunction(0)
        props.setCurrentClassesComponentFunction((event.target as HTMLDivElement).getAttribute("class") || "");
        // props.instance.isFocus = false;
        props.updateInstance(props.pageId, (event.target as HTMLDivElement).id, props.instance)
        props.setDragStart({ x: event.clientX, y: event.clientY });
    };
    return (
        <div
            id={props.instance.id}
            className="absolute border border-gray-400 cursor-move p-2 hover:border-2 hover:border-gray-400 rounded"
            style={{
                width: props.instance.size.width,
                height: props.instance.size.height,
                left: props.instance.position.x,
                top: props.instance.position.y,
                backgroundColor: props.instance.backgroundColor
            }}
            draggable="true"
            onDragStart={(e) => handleDragStart(e)}
            onFocus={(event) => {
                props.instance.isFocus = true;
                props.updateInstance(props.pageId, props.instance.id, props.instance)
            }}
            onBlur={(event) => {
                if (isInMenu == false) {
                    props.instance.isFocus = false;
                    props.updateInstance(props.pageId, props.instance.id, props.instance)
                }

            }}
            tabIndex={0}
        >
            {props.instance.isFocus &&
                <SmallMenuComponent
                    pageId={props.pageId}
                    cloneInstance={props.cloneInstance}
                    deleteInstance={props.deleteInstance}
                    id={props.instance.id}
                    updateInstance={props.updateInstance}
                    instance={props.instance}
                    displayMenu={props.displayMenu}
                    setDisplayMenuFunction={props.setDisplayMenuFunction}
                    isInMenu={isInMenu}
                    setIsInMenuFunction={setIsInMenuFunction}
                />
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