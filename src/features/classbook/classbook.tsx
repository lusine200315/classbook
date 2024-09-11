import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useEffect, useState } from "react";
import { getAllStudents } from "../students/students.slice";
import { getAllLessons } from "./classbook.slice";
import styles from './styles.module.css';
import { AddLesson } from "../../utils/add-lesson";
import { Modal } from "../../utils/modal/Modal";

export const ClassBook = () => {
    const students = useAppSelector(state => state.students.list);
    const lessons = useAppSelector(state => state.classbook.lessons);
    const dispatch = useAppDispatch();
    const empty = new Array(16 - lessons.length).fill(null);
    
    useEffect(() => {
        dispatch(getAllStudents());
        dispatch(getAllLessons());
    }, [dispatch]);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
    const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);

    const handleTdClick = (studentId: number, lessonId: number) => {
        const lessonExists = lessons.some(lesson => lesson.id === lessonId);
        
        if (lessonExists) {
            const existingRating = lessons.find(lesson => lesson.id === lessonId)?.ratings
                ?.find(r => r.student === studentId);
            
            if (!existingRating) {
                setSelectedStudentId(studentId);
                setSelectedLessonId(lessonId);
                setIsModalOpen(true);
            } else {
                console.log("Rating already exists.");
            }
        } else {
            console.error("Lesson not found.");
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudentId(null);
        setSelectedLessonId(null);
    };

    return (
        <>
            <h3>Classbook</h3>
            <Link to={'/students'}>Students</Link>
            <p>Students: {students.length}</p>
            <p>Lessons: {lessons.length}</p>
            <AddLesson />    
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th rowSpan={2}>Student</th>
                        <th colSpan={16}>Lessons</th>
                    </tr>
                    <tr>
                        {
                            lessons.map(lesson =>
                                <td className={styles.vertical} key={lesson.id}>{lesson.title}</td>
                            )
                        }
                        {
                            empty.map((_, index) =>
                                <th key={index}></th>
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        students.map(student =>
                            <tr key={student.id}>
                                <td>{student.name} {student.surname}</td>
                                {
                                    lessons.map(lesson => {
                                        const found = lesson?.ratings?.find(r => r.student === student.id);

                                        return (
                                            <td
                                                key={lesson.id}
                                                onClick={() => handleTdClick(student.id, lesson.id)}
                                            >
                                                {found?.rate}
                                            </td>
                                        );
                                    })
                                }
                                {
                                    empty.map((_, index) => <td key={index}></td>)
                                }
                            </tr>
                        )
                    }
                </tbody>
            </table>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                studentId={selectedStudentId}
                lessonId={selectedLessonId}
            />
        </>
    );
};
