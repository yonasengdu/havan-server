import { Response } from "express";
import { redis } from "../utils/redis";
import userModel, { IUser } from "../models/user.model";
import CourseModel, { ICourse } from "../models/course.model";

// get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  

  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(201).json({
      success: true,
      user,
    });
  }
};

// Get All users
export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });

  res.status(201).json({
    success: true,
    users,
  });
};
// Get All usersWithcource
export const getAllUsersCourseService = async (res: Response, page:string, dir:string) => {

  let usersWithCourses ;
  if (page==="0"){
    usersWithCourses  = await userModel.find().skip(0).limit(10);
  }
  else{

    if (dir==="1"){
    usersWithCourses  = await userModel.find().skip(Number(page)*10).limit(10);
    }
    else{

      let start= Number(page)*10 -10
      usersWithCourses  = await userModel.find().skip(start).limit(10);

    }

  }

  // const users = await userModel.find().sort({ createdAt: -1 });

  // Function to fetch course details based on IDs
const fetchCourseDetails = async (courseIds) => {
  const courseDetails = await CourseModel.find({ _id: { $in: courseIds } });
  return courseDetails;
};

// Iterate through users and fetch course details
const usersWithCourseDetails = await Promise.all(
  usersWithCourses.map(async (user) => {
    const courseDetails = await fetchCourseDetails(user.courses);
    return { ...user.toObject(), courses: courseDetails };
  })
);

// console.log(usersWithCourseDetails);
  
  res.status(201).json({
    success: true,
    usersWithCourseDetails,
  });
};

// update user role
export const updateUserRoleService = async (res:Response,id: string,role:string) => {
  const user = await userModel.findByIdAndUpdate(id, { role }, { new: true });

  res.status(201).json({
    success: true,
    user,
  });
}