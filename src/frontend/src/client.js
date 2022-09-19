import axios from "axios"


export const getAllStudents = async () => {

        const response = await axios.get("api/v1/students")
    //console.log(response)
        return response.data

}
export const addNewStudent = async student => {


    await axios.post("api/v1/students",
        JSON.stringify(student),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    )
}

export const deleteStudent = async studentId => {

    await axios.delete(`api/v1/students/${studentId}`)

}