import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "semantic-ui-css/semantic.min.css";
import { Button, Container, Form, Menu } from "semantic-ui-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [file, setFile] = useState<any>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  function handleChange(event: any) {
    setFile(event.target.files[0]);
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    if (!file) {
      alert("You have Not Selected file.");
      return;
    }

    const url = "http://localhost:5000/logs/parse";
    const data = new FormData();
    data.append("file", file);
    setIsUploading(true);
    axios
      .post(url, data)
      .then((response) => {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setIsUploading(false);
        const url = window.URL.createObjectURL(
          new Blob([JSON.stringify(response.data.logs, null, 2)])
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "ParsedLog.log");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        setIsUploading(false);
        toast.error("Unable to Parse the Log", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log({ err });
      });
  }

  return (
    <div className="App">
      <Menu>
        <Menu.Item disabled={false}>
          <h1>Log Parser</h1>
        </Menu.Item>
      </Menu>
      <br />
      <Container>
        <div className="wrapper">
          <div className="child">
            <div className="box">
              <div className="">
                {!file ? (
                  <p className="select-file-paragraph">
                    Select A File to Parse Logs(*)
                  </p>
                ) : (
                  <p className="select-file-paragraph">
                    You have Selected {file?.name} 👍
                  </p>
                )}
                <div className="outlined-box">
                  <Form onSubmit={handleSubmit}>
                    <Form.Field className="file-input">
                      <Button as="label" htmlFor="file" type="button">
                        <img
                          src="/images/upload-icon.svg"
                          height={40}
                          width={30}
                          alt={"Upload Image"}
                        />
                      </Button>
                      <input
                        type="file"
                        id="file"
                        hidden
                        onChange={handleChange}
                      />
                      <Button type="submit">
                        {!isUploading ? "Upload" : "Uploading..."}
                      </Button>
                    </Form.Field>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Container>
    </div>
  );
}

export default App;
