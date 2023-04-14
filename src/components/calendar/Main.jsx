// import "@fullcalendar/core/vdom";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import dom from "@left4code/tw-starter/dist/js/dom";
import { Lucide, FullCalendar, Modal, ModalBody } from "@/base-components";
import { LoadingIcon } from "@/base-components";
import { useState } from "react";


const Main = (props) => {
  const {
    type,
    events,
    deleteEvent,
    setEventId,
    deleteConfirmationModal,
    setDeleteConfirmationModal,
    loading
  } = props;

  //(events.contents);
  const [modelTitle, setModelTitle] = useState("");
  const [modelDescription, setModelDescription] = useState("");
  const options = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    droppable: false,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
    },
    aspectRatio: 1.5,
    height : 'auto',
    navLinks: true,
    editable: true,
    events: events,
    eventClick: function (info) {
      // alert("Event: " + info.event._def.extendedProps.description);

      //setModelTitle()
      setModelDescription(info.event._def.extendedProps.description);
      setModelTitle(info.event.title);
      setDeleteConfirmationModal(true);

      setEventId(info.event._def.extendedProps.ev_id);
      // change the border color just for fun
      // info.el.style.borderColor = "red";
    },
  };

  return (
    <>
      <FullCalendar options={options} />

      <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteConfirmationModal(false);
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide
              icon="Calendar"
              className="w-16 h-16 text-info mx-auto mt-3"
            />
            <div className="text-3xl mt-5">{modelTitle}</div>
            <div className="text-slate-500 mt-2">{modelDescription}</div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            {type == 1 && (
              <button
                type="button"
                onClick={deleteEvent}
                className="btn btn-danger w-24"
              >
                Delete
                {loading && (
                  <LoadingIcon
                    icon="three-dots"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                )}
              </button>
            )}
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Main;
