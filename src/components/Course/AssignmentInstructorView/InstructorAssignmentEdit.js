import React, { useRef, useState } from "react";
import {
  Card,
  Form,
  Col,
  Button,
} from "react-bootstrap";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import { useCourse } from "../../../contexts/CourseContext";

export default function InstructorAssignmentEdit(props) {
  const { updateAssignment, removePreviousAttachments } = useCourse();
  const fileInputRef = useRef();
  const releaseDateRef = useRef();
  const dueDateRef = useRef();
  const totalPointsRef = useRef();
  const pointStepRef = useRef();
  const titleRef = useRef();
  const [loading, setLoading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(
    () => !props.assignment.isPublished
  );
  const [selectedFiles, setSelectedFiles] = useState(
    () => props.assignment.attachments
  );
  const [filesHaveChanged, setFilesHaveChanged] = useState(false);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createWithContent(
      convertFromRaw(JSON.parse(props.assignment.content))
    )
  );
  const handleEditorChange = (state) => {
    setEditorState(state);
  };
  async function handleUpdateAssignment(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const rawState = convertToRaw(editorState.getCurrentContent());
      if (filesHaveChanged)
        await removePreviousAttachments(props.courseId, props.assignment.id);
      await updateAssignment(
        props.courseId,
        props.assignment.id,
        titleRef.current.value,
        JSON.stringify(rawState),
        filesHaveChanged,
        selectedFiles,
        totalPointsRef.current.value,
        pointStepRef.current.value,
        !isPrivate,
        new Date(releaseDateRef.current.value).valueOf(),
        new Date(dueDateRef.current.value).valueOf()
      );
      props.setMessage("Sucessfully updated the assignment!");
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div>
      <Form onSubmit={handleUpdateAssignment}>
        <Card className="card-outline-dark">
          <Card.Header>Edit Assignment</Card.Header>
          <Card.Body>
            <Form.Group id="assignmentTitle">
              <Form.Label>Assignment Title</Form.Label>
              <Form.Control
                type="text"
                disabled={loading}
                ref={titleRef}
                defaultValue={props.assignment.title}
                required
              />
            </Form.Group>
            <Form.Group id="assignmentContent">
              <Form.Label>Description</Form.Label>
              <Editor
                readOnly={loading}
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
                toolbar={{
                  options: [
                    "inline",
                    "fontSize",
                    "fontFamily",
                    "textAlign",
                    "list",
                    "link",
                    "image",
                    "history",
                  ],
                }}
              />
            </Form.Group>
            <Form.Row>
              <Col>
                <Form.Label>Total Points</Form.Label>
                <Form.Control
                  ref={totalPointsRef}
                  disabled={loading}
                  type="number"
                  defaultValue={props.assignment.totalPoints}
                  min={1}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Point Step Value</Form.Label>
                <Form.Control
                  ref={pointStepRef}
                  disabled={loading}
                  type="number"
                  defaultValue={props.assignment.pointStep}
                  min={0.25}
                  max={0.5}
                  step={0.25}
                  required
                />
              </Col>
            </Form.Row>
            <Form.Row className="mt-2">
              <Col>
                <Form.Label>Release Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  disabled={loading}
                  required
                  ref={releaseDateRef}
                  defaultValue={new Date(
                    props.assignment.releaseDate -
                      new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 16)}
                  min={new Date(
                    props.assignment.creationDate -
                      new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 16)}
                />
              </Col>
              <Col>
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="datetime-local"
                  disabled={loading}
                  ref={dueDateRef}
                  defaultValue={new Date(
                    props.assignment.dueDate -
                      new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 16)}
                  min={new Date(
                    props.assignment.creationDate -
                      new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 16)}
                  required
                />
              </Col>
            </Form.Row>
            <Form.Group className="mt-2" id="assignmentAttachments">
              <Form.File
                ref={fileInputRef}
                id="fileButton"
                className="d-none"
                multiple
                onChange={(e) => {
                  if (e.target.files.length === 0) {
                    setSelectedFiles(null);
                  } else {
                    setSelectedFiles(e.target.files);
                  }
                  setFilesHaveChanged(true);
                }}
              />
              <Card className="mt-2 border-0">
                <Card.Header className="p-1">
                  <p className="m-0">Attachments</p>
                </Card.Header>
                <Card.Body className="pl-2">
                  {selectedFiles && (
                    <>
                      {Array.from(selectedFiles).map((file, index) => {
                        return (
                          <p className="m-0">{file.name || file.fileName} ✔️</p>
                        );
                      })}
                    </>
                  )}
                </Card.Body>
              </Card>
            </Form.Group>
          </Card.Body>
          <Card.Footer>
            <Button
              disabled={loading}
              variant="primary"
              size="sm"
              type="submit"
            >
              {isPrivate ? "Save Changes" : "Publish"}
            </Button>
            <Button
              className="ml-3"
              disabled={loading}
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current.click()}
            >
              Upload File
            </Button>
            <Form.Check
              disabled={loading}
              className="d-inline-block ml-3"
              type="switch"
              id="custom"
              label="Private"
              defaultChecked={!props.assignment.isPublished}
              onChange={(e) => {
                if (e.target.checked) setIsPrivate(true);
                else setIsPrivate(false);
              }}
            />
          </Card.Footer>
        </Card>
      </Form>
    </div>
  );
}
