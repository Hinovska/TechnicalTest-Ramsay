using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Net;
using brAplication = Ramsay.BusinessRules;
using sfEntities = Ramsay.SystemFramework.Entities;

namespace Ramsay.WebApp.Controllers
{
    [Authorize]
    [Route("api/v1/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {

        private brAplication.Student.Student brStudent;
        private IConfiguration _config;
        private readonly ILogger<StudentController> _logger;

        /// <summary>
        /// Constructor
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="config"></param>
        public StudentController(ILogger<StudentController> logger, IConfiguration config)
        {
            _config = config;
            _logger = logger;
            this.brStudent = new brAplication.Student.Student(_config);
        }

        // GET: api/v1/<StudentController>
        [HttpGet]
        public IActionResult Get()
        {
            APIEntities.OperationAPI<List<sfEntities.Student.Student>> objResponse = new APIEntities.OperationAPI<List<sfEntities.Student.Student>>();
            try
            {
                objResponse.Data = brStudent.Search(new sfEntities.Find.Student());
                objResponse.Message = ((objResponse.Data != null) ? objResponse.Data.Count : 0) + " students found";
                objResponse.StatusCode = HttpStatusCode.OK.ToString();
                return Ok(objResponse);
            }
            catch (Exception ex)
            {
                objResponse.StatusCode = HttpStatusCode.InternalServerError.ToString();
                objResponse.Message = ex.Message;
                objResponse.StatusCode = HttpStatusCode.NotFound.ToString();
                return NotFound(objResponse);
            }
        }

        // GET api/v1/<StudentController>/5
        [HttpGet("{id}")]
        public IActionResult Get(Int32 id)
        {
            if (id > 0)
            {
                APIEntities.OperationAPI<List<sfEntities.Student.Student>> objResponse = new APIEntities.OperationAPI<List<sfEntities.Student.Student>>();
                try
                {
                    sfEntities.Student.Student result = brStudent.Load(id);
                    objResponse.Data = (result != null) ? new List<sfEntities.Student.Student>() { result } : null;
                    objResponse.Message = (objResponse.Data == null) ? "Student not found" : "Student found";
                    objResponse.StatusCode = HttpStatusCode.OK.ToString();
                    return Ok(objResponse);
                }
                catch (Exception ex)
                {
                    objResponse.StatusCode = HttpStatusCode.InternalServerError.ToString();
                    objResponse.Message = ex.Message;
                    return NotFound(objResponse);
                }
            }
            return BadRequest();
        }

        // POST api/v1/<StudentController>
        [HttpPost]
        public IActionResult Register([FromBody] sfEntities.Student.Student objNewStudent)
        {
            if (brStudent.IsValid(objNewStudent))
            {
                APIEntities.OperationAPI<List<sfEntities.Student.Student>> objResponse = new APIEntities.OperationAPI<List<sfEntities.Student.Student>>();
                try
                {
                    if (!brStudent.Exists(objNewStudent.Username))
                    {
                        sfEntities.Student.Student result = brStudent.Registrer(objNewStudent);
                        objResponse.Data = (result != null) ? new List<sfEntities.Student.Student>() { result } : null;
                        objResponse.Message = "The student " + objNewStudent.Username + " has been added !!";
                        objResponse.StatusCode = HttpStatusCode.OK.ToString();
                        return Ok(objResponse);
                    }
                    else
                    {
                        objResponse.Message = "The student " + objNewStudent.Username + " already exists";
                        objResponse.StatusCode = HttpStatusCode.Conflict.ToString();
                        return Conflict(objResponse);
                    }
                }
                catch (Exception ex)
                {
                    objResponse.StatusCode = HttpStatusCode.InternalServerError.ToString();
                    objResponse.Message = ex.Message;
                    return NotFound(objResponse);
                }
            }
            return BadRequest();
        }

        // POST api/v1/<StudentController>
        [HttpPost("search")]
        public IActionResult Search([FromBody] sfEntities.Find.Student sfFind)
        {
            if (sfFind != null)
            {
                APIEntities.OperationAPI<List<sfEntities.Student.Student>> objResponse = new APIEntities.OperationAPI<List<sfEntities.Student.Student>>();
                try
                {
                    objResponse.Data = brStudent.Search(sfFind);
                    objResponse.Message = ((objResponse.Data != null) ? objResponse.Data.Count : 0) + " students found";
                    objResponse.StatusCode = HttpStatusCode.OK.ToString();
                    return Ok(objResponse);
                }
                catch (Exception ex)
                {
                    objResponse.StatusCode = HttpStatusCode.InternalServerError.ToString();
                    objResponse.Message = ex.Message;
                    return NotFound(objResponse);
                }
            }
            return BadRequest();
        }

        // PUT api/v1/<StudentController>/5
        [HttpPut("{Id}")]
        public IActionResult Put(Int32 Id, [FromBody] sfEntities.Student.Student objStudent)
        {
            if (Id > 0 && brStudent.IsValid(objStudent) )
            {
                APIEntities.OperationAPI<List<sfEntities.Student.Student>> objResponse = new APIEntities.OperationAPI<List<sfEntities.Student.Student>>();
                objStudent.Id = Id;      
                try
                {
                    sfEntities.Student.Student result = brStudent.Modify(objStudent);
                    if (result != null)
                    {
                        objResponse.Data = new List<sfEntities.Student.Student>() { result };
                        objResponse.Message = "The student " + objStudent.Username + " has been modified !!";
                        objResponse.StatusCode = HttpStatusCode.OK.ToString();
                        return Ok(objResponse);
                    }
                    else
                    {
                        objResponse.Data = null;
                        objResponse.Message = "It has not been possible to modify the student " + objStudent.Username;
                        objResponse.StatusCode = HttpStatusCode.Unauthorized.ToString();
                        return Unauthorized(objResponse);
                    }
                }
                catch (Exception ex)
                {
                    objResponse.StatusCode = HttpStatusCode.InternalServerError.ToString();
                    objResponse.Message = ex.Message;
                    return NotFound(objResponse);
                }
            }
            return BadRequest();
        }

        // DELETE api/v1/<StudentController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(Int32 id)
        {
            if (id > 0)
            {
                APIEntities.OperationAPI<sfEntities.Student.Student> objResponse = new APIEntities.OperationAPI<sfEntities.Student.Student>();
                try
                {
                    if (brStudent.Remove(id))
                    {
                        objResponse.Data = null;
                        objResponse.Message = "The student has been removed";
                        objResponse.StatusCode = HttpStatusCode.OK.ToString();
                        return Ok(objResponse);
                    }
                    else
                    {
                        objResponse.Data = null;
                        objResponse.Message = "It has not been possible to remove the student";
                        objResponse.StatusCode = HttpStatusCode.NotFound.ToString();
                        return NotFound(objResponse);
                    }
                }
                catch (Exception ex)
                {
                    objResponse.StatusCode = HttpStatusCode.InternalServerError.ToString();
                    objResponse.Message = ex.Message;
                    return NotFound(objResponse);
                }
            }
            return BadRequest();
        }

    }
}
