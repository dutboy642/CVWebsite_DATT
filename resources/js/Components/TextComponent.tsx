import { TextComponentInstance } from "@/types";
import { useRef, useState } from "react";
import { position } from "@/types";
import ReactQuill from 'react-quill';


interface TextComponentProps {
    dragStart: position
    updateInstance: (pageId: string, id: string, updatedInstance: TextComponentInstance) => void
    instance: TextComponentInstance
    setDragStart: (x: position) => void
    setCurrentClassesComponentFunction: (x: string) => void
    deleteInstance: (pageId: string, id: string) => void
    cloneInstance: (pageId: string, id: string) => void
    scaleValue: number
    pageId: string
    displayMenu: number
    setDisplayMenuFunction: (x: number) => void

}

const TextComponent: React.FC<TextComponentProps> = (props) => {
    const [SizeStart, setSizeStart] = useState({ width: 0, height: 0 });
    const [positionStart, setPositionStart] = useState({ x: 0, y: 0 });
    const [displayToolbar, setDisplayToolbar] = useState('none');
    const [isInMenu, setIsInMenu] = useState(false);

    let resizeDirection = ""
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFocusClick = () => {
        // Kiểm tra inputRef hiện có và focus vào nó nếu có
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    const handleTextResize = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        let newWidth = props.instance.size.width;
        let newHeight = props.instance.size.height;
        let newX = props.instance.position.x;
        let newY = props.instance.position.y;
        switch (resizeDirection) {
            case "right":
                newWidth = SizeStart.width + (event.clientX - props.dragStart.x) / props.scaleValue * 100;
                break;
            case "bottom":
                newHeight = SizeStart.height + (event.clientY - props.dragStart.y) / props.scaleValue * 100;
                break;
            case "left":
                newWidth = SizeStart.width - (event.clientX - props.dragStart.x) / props.scaleValue * 100;
                newX = positionStart.x - (props.dragStart.x - event.clientX) / props.scaleValue * 100

                break;
            case "top":
                newHeight = SizeStart.height - (event.clientY - props.dragStart.y) / props.scaleValue * 100;
                newY = positionStart.y - (props.dragStart.y - event.clientY) / props.scaleValue * 100

                break;
        }
        props.instance.position = { x: newX, y: newY };
        props.instance.size = { width: newWidth, height: newHeight };
        props.setDragStart({ x: event.clientX, y: event.clientY })
        // props.updateInstance(props.instance.id, props.instance) // chi update khi end

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
        setPositionStart({ x: props.instance.position.x, y: props.instance.position.y });
        resizeDirection = direction;
        // setCurrentIDComponent((event.target as HTMLDivElement).id.split(direction)[1])
        window.addEventListener("mousemove", handleTextResize);
        window.addEventListener("mouseup", handleResizeTextEnd);
    };

    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData("text/plain", "component");
        event.dataTransfer.setData("Id", (event.target as HTMLDivElement).id);
        event.dataTransfer.setData("pageId", props.pageId);

        props.setCurrentClassesComponentFunction((event.target as HTMLDivElement).getAttribute("class") || "");
        props.instance.isFocus = false;
        props.updateInstance(props.pageId, (event.target as HTMLDivElement).id, props.instance)
        props.setDragStart({ x: event.clientX, y: event.clientY });
    };

    return (
        <div
            id={props.instance.id}
            className="absolute border border-gray-400 cursor-move textComponent p-2 hover:border-2 hover:border-gray-400 rounded"
            ref={inputRef}
            style={{
                width: props.instance.size.width,
                height: props.instance.size.height,
                left: props.instance.position.x,
                top: props.instance.position.y,
            }}
            onFocus={(event) => {
                props.instance.isFocus = true;
                props.updateInstance(props.pageId, props.instance.id, props.instance)
                setDisplayToolbar('block')

            }}
            onBlur={(event) => {
                if (isInMenu == false) {
                    props.instance.isFocus = false;
                    props.updateInstance(props.pageId, props.instance.id, props.instance)
                    setDisplayToolbar('none')
                    console.log(document.querySelector('#' + props.instance.id + " .ql-editor")?.innerHTML)
                    let editorElement = document.querySelector('#' + props.instance.id + " .ql-editor")
                    // if (editorElement) { editorElement.innerHTML = "<p><strong>nguvl&nbsp; asdsad</strong></p><p><em>ssssss</em></p><p><br></p>"; }
                }

            }}
            tabIndex={0}
            draggable="true"
            onDragStart={handleDragStart}
        >

            <div
                className='h-full'
                onMouseDown={(e) => {
                    document.getElementById(props.instance.id)?.setAttribute("draggable", "false")
                    window.addEventListener("mouseup", () => { document.getElementById(props.instance.id)?.setAttribute("draggable", "true") });
                }
                }
            >
                <div id={props.instance.id + "toolbar"}
                    className="w-96 bg-white"
                    style={{ display: displayToolbar, position: "absolute", top: '0', right: '50%', transform: "translate(50%,-130%)", zIndex: 9999 }}
                    // onFocus={(e) => {
                    //     e.stopPropagation()
                    // }}
                    // onClick={() => handleFocusClick()}
                    // onMouseDown={
                    //     (e) => {
                    //         e.stopPropagation()
                    //     }
                    // }
                    onMouseEnter={(e) =>
                        // isMouseOverInner = true
                        setIsInMenu(true)
                    }
                    onMouseLeave={(e) =>
                        // isMouseOverInner = false
                        setIsInMenu(false)

                    }
                >
                    <button className="ql-bold"
                        onClick={() => handleFocusClick()}
                    ></button>
                    <button className="ql-italic"
                    ></button>
                    <button className="ql-underline"
                    ></button>
                    <select className="ql-color"
                    ></select>
                    <select className="ql-font"></select>
                    <select className="ql-align"></select>
                    <select className="ql-background"></select>

                    <select className="ql-size">
                        <option value="small"></option>
                        <option selected></option>
                        <option value="large"></option>
                    </select>
                </div>

                <ReactQuill
                    id={'quill' + props.instance.id}
                    className='p-0 h-full'
                    value={props.instance.text}
                    onChange={(value) => {
                        props.instance.text = value;
                        props.updateInstance(props.pageId, props.instance.id, props.instance)
                    }}
                    // modules={{
                    //     toolbar: [
                    //         [{ header: [1, 2, 3, 4, false] }],
                    //         ['bold', 'italic', 'underline'],
                    //         // ['image', 'code-block'],
                    //         [{ 'font': [] }],
                    //         [{ 'color': [] }, { 'background': [] }],
                    //     ],

                    // }}
                    modules={{ toolbar: { container: '#' + props.instance.id + "toolbar" } }}
                    theme="snow"
                />


            </div>

            {
                props.instance.isFocus &&
                <div
                    id={'left' + props.instance.id}
                    className="absolute w-1 h-4 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ top: "50%", left: "-2px", transform: "translateY(-50%)" }}
                    onMouseDown={(e) => handleResizeTextStart(e, "left")}
                    onMouseMove={(e) => resizeDirection === "left" ? handleTextResize : undefined}
                    onMouseUp={handleResizeTextEnd}
                />
            }
            {
                props.instance.isFocus &&
                <div
                    id={'top' + props.instance.id}
                    className="absolute w-4 h-1 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ top: "-2px", left: "50%", transform: "translateX(-50%)" }}
                    onMouseDown={(e) => handleResizeTextStart(e, "top")}
                    onMouseMove={(e) => resizeDirection === "top" ? handleTextResize : undefined}
                    onMouseUp={handleResizeTextEnd}
                />
            }
            {
                props.instance.isFocus &&
                <div
                    id={'bottom' + props.instance.id}
                    className="absolute w-4 h-1 bg-black-500 border border-gray-500/80 cursor-pointer rounded"
                    style={{ bottom: "-2px", left: "50%", transform: "translateX(-50%)" }}
                    onMouseDown={(e) => handleResizeTextStart(e, "bottom")}
                    onMouseMove={(e) => resizeDirection === "bottom" ? handleTextResize : undefined}
                    onMouseUp={handleResizeTextEnd}
                />
            }
            {
                props.instance.isFocus &&
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
        </div >)
}

export default TextComponent;