using Ramsay.DataAccess.Factory;
using Ramsay.DataAccess.Interface;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using sfEntities = Ramsay.SystemFramework.Entities;

namespace Ramsay.BusinessRules.Student
{
    public class Student
    {

        #region Properties

        private StudentFactory factory;
        private IDatabase<sfEntities.Student.Student, sfEntities.Find.Student> student;

        #endregion

        #region Constructors

        public Student(IConfiguration config)
        {
            this.factory = new AgentStudentFactory();
            this.student = factory.GetInstance(config);
        }

        #endregion

        #region Cruds

        /// <summary>
        /// Use for add a student
        /// </summary>
        /// <param name="objStudent"></param>
        /// <returns></returns>
        private sfEntities.Student.Student Insert(sfEntities.Student.Student objStudent)
        {
            sfEntities.Student.Student result = student.Insert(objStudent);
            return result;
        }

        /// <summary>
        /// Use for get a student info by id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        private sfEntities.Student.Student Get(Int32 Id)
        {
            student.sfFind = new sfEntities.Find.Student() { Id = Id };
            sfEntities.Student.Student result = student.Get();
            return result;
        }

        /// <summary>
        /// Use for get a student info by username
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        private sfEntities.Student.Student GetByUsername(string username)
        {
            student.sfFind = new sfEntities.Find.Student() { Username = username };
            sfEntities.Student.Student result = student.Get();
            return result;
        }

        /// <summary>
        /// Use for modify a student data
        /// </summary>
        /// <param name="objStudent"></param>
        /// <returns></returns>
        private sfEntities.Student.Student Update(sfEntities.Student.Student objStudent)
        {
            sfEntities.Student.Student result = student.Update(objStudent);
            return result;
        }

        /// <summary>
        /// Use for remove a student
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        private bool Delete(Int32 Id)
        {
            bool result = student.Delete(new sfEntities.Student.Student() { Id = Id });
            return result;
        }

        /// <summary>
        /// Use for list students query
        /// </summary>
        /// <param name="sfFind"></param>
        /// <returns></returns>
        private List<sfEntities.Student.Student> List(sfEntities.Find.Student sfFind)
        {
            student.sfFind = sfFind;
            List<sfEntities.Student.Student> result = student.List();
            return result;
        }

        #endregion

        #region Public Metods

        /// <summary>
        /// Use for register a student
        /// </summary>
        /// <param name="objStudent"></param>
        /// <returns></returns>
        public sfEntities.Student.Student Registrer(sfEntities.Student.Student objStudent)
        {
            sfEntities.Student.Student result = null;
            if (this.IsValid(objStudent))
            {
                result = this.Insert(objStudent);
            }
            return result;
        }

        /// <summary>
        /// Use for get information of specific student
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public sfEntities.Student.Student Load(Int32 Id)
        {
            sfEntities.Student.Student result = this.Get(Id);
            return result;
        }

        /// <summary>
        /// Use for update a student
        /// </summary>
        /// <param name="objStudent"></param>
        /// <returns></returns>
        public sfEntities.Student.Student Modify(sfEntities.Student.Student objStudent)
        {
            sfEntities.Student.Student result = null;
            if (this.IsValid(objStudent) && objStudent.Id > 0)
            { 
                result = this.Update(objStudent);
            }
            return result;
        }

        /// <summary>
        /// Use for delete a student
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public bool Remove(Int32 Id)
        {
            return this.Delete(Id);
        }

        /// <summary>
        /// Use for search students with parameters in sfFind
        /// </summary>
        /// <param name="sfFind"></param>
        /// <returns></returns>
        public List<sfEntities.Student.Student> Search(sfEntities.Find.Student sfFind)
        {
            List<sfEntities.Student.Student> result = this.List(sfFind);
            return result;
        }

        /// <summary>
        /// Use for verifi exists a student by username
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        public bool Exists(string username)
        {
            return (this.FindStudent(username) != null);
        }

        /// <summary>
        /// User for validate input values in Student
        /// </summary>
        /// <param name="student"></param>
        /// <returns></returns>
        public bool IsValid(sfEntities.Student.Student student)
        {
            return (student != null && student != new sfEntities.Student.Student()
                && !string.IsNullOrEmpty(student.Username) && !string.IsNullOrEmpty(student.FirstName)
                 && !string.IsNullOrEmpty(student.LastName));
        }

        #endregion

        #region Private Metods


        /// <summary>
        /// User for search user by username or email
        /// </summary>
        /// <param name="username"></param>
        /// <returns></returns>
        private sfEntities.Student.Student FindStudent(string username)
        {
            sfEntities.Student.Student userData = null;
            if (!string.IsNullOrEmpty(username))
            {
                userData = this.GetByUsername(username);
            }
            return userData;
        }

        #endregion

    }
}
