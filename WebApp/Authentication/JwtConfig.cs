using System.Collections.Generic;

namespace Ramsay.WebApp.Authentication
{
    public class JwtConfig
    {
        public string key { get; set; }
        public List<APIAuthUser> AuthUsers { get; set; }
    }

    public class APIAuthUser
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
