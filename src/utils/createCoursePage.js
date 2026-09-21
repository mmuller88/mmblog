import React from "react"
import CourseDetail from "../components/CourseDetail"
import { getCourse } from "../data/coursesContent"

const createCoursePage = (slug, locale) => {
 const CoursePage = ({ location }) => (
  <CourseDetail course={getCourse(slug, locale)} location={location} />
 )
 CoursePage.displayName = `CoursePage(${slug}, ${locale})`
 return CoursePage
}

export default createCoursePage
