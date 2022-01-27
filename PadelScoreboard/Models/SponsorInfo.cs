using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace PadelScoreboard.Models
{
    public class SponsorInfo
    {
        [JsonProperty("id")]
        public Guid Id { get; set; }

        [JsonProperty("naam")]
        public string Naam { get; set; }

        [JsonProperty("foto")]
        public string Foto { get; set; }

        [JsonProperty("extra")]
        public string Extra { get; set; }
    }
}
