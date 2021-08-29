using Newtonsoft.Json;

namespace Ramsay.WebApp.APIEntities
{
    public class OperationAPI<T>
    {
        #region Properties
        [JsonProperty("data")]
        public T Data { get; set; }
        [JsonProperty("message")]
        public string Message { get; set; }
        [JsonProperty("statuscode")]
        public string StatusCode { get; set; }

        #endregion
    }
}
