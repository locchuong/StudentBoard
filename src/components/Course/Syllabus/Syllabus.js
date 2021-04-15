import React, { useState } from "react";
import { useCourse } from "../../../contexts/CourseContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useParams } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import { EditorState, convertToRaw, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import "../../../stylesheets/Syllabus.css";

export default function Syllabus() {
  const { courseId } = useParams();
  const { courseObjects, userObject } = useAuth();
  const { createMarkup, updateSyllabus } = useCourse();
  const course = courseObjects.find(({ id }) => id === courseId);
  const [loading, setLoading] = useState(false); // Handles disabling buttons on load
  const [isSaved, setisSaved] = useState(true);
  const [isPreview, setisPreview] = useState(true); // Handles view/edit mode
  // Handles rich text editor
  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty();
  });
  // Handles preview mode
  const [convertedContent, setConvertedContent] = useState(() => {
    return course.syllabusContent
      ? draftToHtml(JSON.parse(course.syllabusContent))
      : null;
  });
  // Handles on change of editor and changing preview to match
  const handleEditorChange = (state) => {
    setEditorState(state);
    setConvertedContent(
      draftToHtml(convertToRaw(editorState.getCurrentContent()))
    );
    setisSaved(false);
  };
  // Handles updating state of syllabus page for the course object
  async function handleUpdate() {
    try {
      setLoading(true);
      const rawState = convertToRaw(editorState.getCurrentContent());
      await updateSyllabus(course, JSON.stringify(rawState));
      setisSaved(true);
      setisPreview(true);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }

  return (
    <div className="flex-grow-1 d-flex flex-column">
      <div className="syllabus-header">
        <h3>Syllabus</h3>
        {isPreview && userObject.isInstructor && (
          <div className="d-flex flex-row">
            {!isSaved && (
              <Button variant="outline-warning" active>
                UNSAVED
              </Button>
            )}
            <Button
              disabled={loading}
              variant="outline-dark"
              className="ml-3"
              onClick={() => {
                if (isSaved && course.syllabusContent)
                  setEditorState(
                    EditorState.createWithContent(
                      convertFromRaw(JSON.parse(course.syllabusContent))
                    )
                  );
                setisPreview(false);
              }}
            >
              Edit
            </Button>
          </div>
        )}
      </div>
      <hr></hr>
      {isPreview ? (
        <div dangerouslySetInnerHTML={createMarkup(convertedContent)}></div>
      ) : (
        <Card className="card-outline-dark mb-5 flex-grow-1">
          <Card.Header>Edit Syllabus</Card.Header>
          <Card.Body className="d-flex">
            <Editor
              editorState={editorState}
              onEditorStateChange={handleEditorChange}
              wrapperClassName="wrapper-class d-flex flex-column w-100"
              editorClassName="editor-class flex-grow-1"
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
          </Card.Body>
          <Card.Footer>
            <Button
              disabled={loading}
              className="mt-2"
              variant="success"
              size="sm"
              onClick={() => handleUpdate()}
            >
              Save Changes
            </Button>
            <Button
              disabled={loading}
              className="mt-2 float-right"
              variant="link"
              onClick={() => setisPreview(true)}
            >
              Cancel
            </Button>
          </Card.Footer>
        </Card>
      )}
    </div>
  );
}
