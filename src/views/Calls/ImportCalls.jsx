import {
  Dropzone,
  PreviewComponent,
  Lucide,
  Modal,
  ModalBody,
  LoadingIcon,
  Litepicker,
} from "@/base-components";

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import { adminApi } from "../../configuration";

import { useEffect, useRef } from "react";
const token = localStorage.token && localStorage.getItem("token");
const ImportCalls = (props) => {
  let { id } = useParams();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dropzoneSingleRef = useRef();
  const dropzoneMultipleRef = useRef();
  const dropzoneValidationRef = useRef();

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10 mb-10">
        Import Calls From Excel
      </h2>
      <Dropzone
        getRef={(el) => {
          dropzoneSingleRef.current = el;
        }}
        options={{
          url: adminApi() + "call/import",
          thumbnailWidth: 150,
          maxFiles: 1,
          headers: { Authorization: `Bearer ${token}` },
        }}
        className="dropzone"
      >
        <div className="text-lg font-medium">
          Drop files here or click to upload.
        </div>
        <div className="text-gray-600">
          This is just a demo dropzone. Selected files are
          <span className="font-medium">not</span> actually uploaded.
        </div>
      </Dropzone>
    </>
  );
};

export default ImportCalls;
