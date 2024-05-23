import { findAllCourses, findLessonsForCourse, findAllUsers } from './db-data';
const { MongoClient, ServerApiVersion } = require('mongodb');
const util = require('util');
const password = require('password-hash-and-salt');

const uri = 'mongodb://localhost:27017/nestjs-course';
var ObjectId = require('mongodb').ObjectId;
//console.log('ObjectId Initialized: ', ObjectId);
console.log('Populating the MongoDB database with some sample data ...');

// Database Name
const dbName = 'nestjs-course';
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('nestjs-course').command({ ping: 1 });
    console.log('You successfully connected to MongoDB!');
    const db = client.db(dbName);

    const courses = findAllCourses();
    for (let i = 0; i < courses.length; i++) {
      const course: any = courses[i];

      const newCourse: any = { ...course };
      delete newCourse.id;

      console.log('Inserting course ', newCourse);

      const result = await db.collection('courses').insertOne(newCourse);
      const courseId = result.insertedId;
      console.log('new course id', courseId);

      const lessons = findLessonsForCourse(course.id);
      for (let j = 0; j < lessons.length; j++) {
        const lesson = lessons[j];

        const newLesson: any = { ...lesson };
        delete newLesson.id;
        delete newLesson.courseId;
        newLesson.courseId = new ObjectId(courseId);
        console.log('new lesson course id', newLesson.courseId);

        console.log('Inserting lesson', newLesson);

        await db.collection('lessons').insertOne(newLesson);
      }
    }
    console.log('Finished uploading data, creating indexes.');

    await db.collection('courses').createIndex({ url: 1 }, { unique: true });

    console.log('Finished creating indexes, exiting.');
    const users = findAllUsers();

    console.log('Inserting users ' + users.length);

    for (let j = 0; j < users.length; j++) {
      const user = users[j];

      const newUser: any = { ...user };
      delete newUser.id;

      const hashPassword = util.promisify(password(newUser.password).hash);

      newUser.passwordHash = await hashPassword();

      delete newUser.password;

      console.log('Inserting user', newUser);

      await db.collection('users').insertOne(newUser);
    }
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

console.log('updloading data to MongoDB...');
run().catch(console.dir);
