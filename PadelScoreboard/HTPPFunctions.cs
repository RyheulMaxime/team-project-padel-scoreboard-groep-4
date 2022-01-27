using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.Cosmos;
using PadelScoreboard.Models;
using System.Collections.Generic;

namespace PadelScoreboard
{
    public class HTPPFunctions
    {
        // ****************************************************************************************************************************************************************
        // Sponsoren
        // ****************************************************************************************************************************************************************

        [FunctionName("GetSponsor")]
        public async Task<IActionResult> GetSponsor([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "sponsor/{sponsorsID}")] HttpRequest req,
            string sponsorsID,
            ILogger log)
        {
            try
            {
                CosmosClient client = new CosmosClient(Environment.GetEnvironmentVariable("CosmosDB"));
                var container = client.GetContainer("Padel", "sponsors");

                var sql = "SELECT * FROM sponsors s WHERE s.id = @id";
                QueryDefinition queryDefinition = new QueryDefinition(sql).WithParameter("@id", sponsorsID);
                FeedIterator<SponsorInfo> feedIterator = container.GetItemQueryIterator<SponsorInfo>(queryDefinition);

                SponsorInfo sponsorInfo = new SponsorInfo();
                while (feedIterator.HasMoreResults)
                {
                    FeedResponse<SponsorInfo> result = await feedIterator.ReadNextAsync();
                    foreach (var info in result)
                    {
                        sponsorInfo = info;
                        break;
                    }
                }

                return new OkObjectResult(sponsorInfo);
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new StatusCodeResult(500);
            }
        }


        [FunctionName("GetSponsors")]
        public async Task<IActionResult> GetSponsors([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "sponsors")] HttpRequest req,
            ILogger log)
        {
            try
            {
                CosmosClient client = new CosmosClient(Environment.GetEnvironmentVariable("CosmosDB"));
                var container = client.GetContainer("Padel", "sponsors");

                var sql = "SELECT * FROM sponsors";
                QueryDefinition queryDefinition = new QueryDefinition(sql);

                List<SponsorInfo> sponsors = new List<SponsorInfo>();
                SponsorInfo sponsorInfo = new SponsorInfo();

                using (FeedIterator<SponsorInfo> feedIterator = container.GetItemQueryIterator<SponsorInfo>(queryDefinition))
                {
                    while (feedIterator.HasMoreResults)
                    {
                        FeedResponse<SponsorInfo> result = await feedIterator.ReadNextAsync();
                        foreach (var info in result)
                        {
                            sponsorInfo = info;
                            sponsors.Add(sponsorInfo);
                        }
                    }
                }

                return new OkObjectResult(sponsors);
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new StatusCodeResult(500);
            }
        }

        [FunctionName("GetSponsorsByClubId")]
        public async Task<IActionResult> GetSponsorsByClubId([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "sponsors/{clubId}")] HttpRequest req,
            string clubId,
            ILogger log)
        {
            try
            {
                CosmosClient client = new CosmosClient(Environment.GetEnvironmentVariable("CosmosDB"));
                var container = client.GetContainer("Padel", "sponsors");

                var sql = "SELECT * FROM sponsors s WHERE s.clubid = @id";
                QueryDefinition queryDefinition = new QueryDefinition(sql).WithParameter("@id", clubId);

                List<SponsorInfo> sponsors = new List<SponsorInfo>();
                SponsorInfo sponsorInfo = new SponsorInfo();

                using (FeedIterator<SponsorInfo> feedIterator = container.GetItemQueryIterator<SponsorInfo>(queryDefinition))
                {
                    while (feedIterator.HasMoreResults)
                    {
                        FeedResponse<SponsorInfo> result = await feedIterator.ReadNextAsync();
                        foreach (var info in result)
                        {
                            sponsorInfo = info;
                            sponsors.Add(sponsorInfo);
                        }
                    }
                }

                return new OkObjectResult(sponsors);
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new StatusCodeResult(500);
            }
        }

        [FunctionName("CreateSponsor")]
        public async Task<IActionResult> CreateSponsor([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "sponsors")] HttpRequest req,
          ILogger log)
        {
            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                SponsorInfo newSponsor = JsonConvert.DeserializeObject<SponsorInfo>(requestBody);
                newSponsor.Id = Guid.NewGuid();

                CosmosClient client = new CosmosClient(Environment.GetEnvironmentVariable("CosmosDB"));
                var container = client.GetContainer("Padel", "sponsors");
                await container.CreateItemAsync<SponsorInfo>(newSponsor, new PartitionKey(newSponsor.ClubId));

                return new OkObjectResult(newSponsor);
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);

                return new StatusCodeResult(500);
            }
        }

        [FunctionName("UpdateSponsor")]
        public async Task<IActionResult> UpdateSponsor([HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "sponsor/{sponsorId}")] HttpRequest req,
          string sponsorId,
          ILogger log)
        {
            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                SponsorInfo updateSponsor = JsonConvert.DeserializeObject<SponsorInfo>(requestBody);

                CosmosClient client = new CosmosClient(Environment.GetEnvironmentVariable("CosmosDB"));
                var container = client.GetContainer("Padel", "sponsors");

                var sql = "SELECT * FROM sponsors s WHERE s.id = @id";

                QueryDefinition queryDefinition = new QueryDefinition(sql).WithParameter("@id", sponsorId);
                FeedIterator<SponsorInfo> feedIterator = container.GetItemQueryIterator<SponsorInfo>(queryDefinition);

                SponsorInfo sponsorInfo = null;

                while (feedIterator.HasMoreResults)
                {
                    FeedResponse<SponsorInfo> result = await feedIterator.ReadNextAsync();
                    foreach (var info in result)
                    {
                        sponsorInfo = info;
                        break;
                    }
                }
                
                sponsorInfo.Naam = updateSponsor.Naam;             
                sponsorInfo.Foto = updateSponsor.Foto;            
                sponsorInfo.Extra = updateSponsor.Extra;

                await container.ReplaceItemAsync<SponsorInfo>(sponsorInfo, sponsorInfo.Id.ToString());

                return new OkObjectResult(sponsorInfo);
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new StatusCodeResult(500);
            }
        }

        [FunctionName("DeleteSponsor")]
        public async Task<IActionResult> DeleteSponsor([HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "sponsor/{sponsorId}")] HttpRequest req,
            string sponsorId,
            ILogger log)
        {
            try
            {
                CosmosClient client = new CosmosClient(Environment.GetEnvironmentVariable("CosmosDB"));
                var container = client.GetContainer("Padel", "sponsors");

                await container.DeleteItemAsync<Task>(sponsorId, new PartitionKey(sponsorId)); 

                return new OkObjectResult("verwijdered");
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);

                return new StatusCodeResult(500);
            }
        }

        // ****************************************************************************************************************************************************************
        // Clubs
        // ****************************************************************************************************************************************************************

        [FunctionName("GetClub")]
        public async Task<IActionResult> GetClub([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "club/{clubID}")] HttpRequest req,
           string clubID,
           ILogger log)
        {
            try
            {
                CosmosClient client = new CosmosClient(Environment.GetEnvironmentVariable("CosmosDB"));
                var container = client.GetContainer("Padel", "clubs");

                var sql = "SELECT * FROM clubs s WHERE s.id = @id";
                QueryDefinition queryDefinition = new QueryDefinition(sql).WithParameter("@id", clubID);
                FeedIterator<ClubInfo> feedIterator = container.GetItemQueryIterator<ClubInfo>(queryDefinition);

                ClubInfo clubInfo = new ClubInfo();
                while (feedIterator.HasMoreResults)
                {
                    FeedResponse<ClubInfo> result = await feedIterator.ReadNextAsync();
                    foreach (var info in result)
                    {
                        clubInfo = info;
                        break;
                    }
                }
                return new OkObjectResult(clubInfo);
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new StatusCodeResult(500);
            }
        }

        [FunctionName("GetClubs")]
        public async Task<IActionResult> GetClubs([HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "clubs")] HttpRequest req,
            ILogger log)
        {
            try
            {
                CosmosClient client = new CosmosClient(Environment.GetEnvironmentVariable("CosmosDB"));
                var container = client.GetContainer("Padel", "clubs");

                var sql = "SELECT * FROM clubs";
                QueryDefinition queryDefinition = new QueryDefinition(sql);

                List<ClubInfo> clubs = new List<ClubInfo>();
                ClubInfo clubInfo = new ClubInfo();

                using (FeedIterator<ClubInfo> feedIterator = container.GetItemQueryIterator<ClubInfo>(queryDefinition))
                {
                    while (feedIterator.HasMoreResults)
                    {
                        FeedResponse<ClubInfo> result = await feedIterator.ReadNextAsync();
                        foreach (var info in result)
                        {
                            clubInfo = info;
                            clubs.Add(clubInfo);
                        }
                    }
                }
                return new OkObjectResult(clubs);
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new StatusCodeResult(500);
            }
        }

        [FunctionName("CreateClub")]
        public async Task<IActionResult> CreateClub([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "clubs")] HttpRequest req,
          ILogger log)
        {
            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                ClubInfo newClub = JsonConvert.DeserializeObject<ClubInfo>(requestBody);
                newClub.Id = Guid.NewGuid();

                CosmosClient client = new CosmosClient(Environment.GetEnvironmentVariable("CosmosDB"));
                var container = client.GetContainer("Padel", "clubs");
                await container.CreateItemAsync<ClubInfo>(newClub);

                return new OkObjectResult(newClub);
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);

                return new StatusCodeResult(500);
            }
        }

        [FunctionName("UpdateClub")]
        public async Task<IActionResult> UpdateClub([HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "club/{clubId}")] HttpRequest req,
          string clubId,
          ILogger log)
        {
            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                ClubInfo updateClub = JsonConvert.DeserializeObject<ClubInfo>(requestBody);

                CosmosClient client = new CosmosClient(Environment.GetEnvironmentVariable("CosmosDB"));
                var container = client.GetContainer("Padel", "clubs");

                var sql = "SELECT * FROM sponsors s WHERE s.id = @id";

                QueryDefinition queryDefinition = new QueryDefinition(sql).WithParameter("@id", clubId);
                FeedIterator<ClubInfo> feedIterator = container.GetItemQueryIterator<ClubInfo>(queryDefinition);

                ClubInfo clubInfo = null;

                while (feedIterator.HasMoreResults)
                {
                    FeedResponse<ClubInfo> result = await feedIterator.ReadNextAsync();
                    foreach (var info in result)
                    {
                        clubInfo = info;
                        break;
                    }
                }

                clubInfo.Naam = updateClub.Naam;
                clubInfo.Logo = updateClub.Logo;
                clubInfo.Straat = updateClub.Straat;
                clubInfo.Stad = updateClub.Stad;
                clubInfo.Beheerder = updateClub.Beheerder;
                clubInfo.Email = updateClub.Email;
                clubInfo.Passwoord = clubInfo.Passwoord;

                await container.ReplaceItemAsync<ClubInfo>(clubInfo, clubInfo.Id.ToString());

                return new OkObjectResult(clubInfo);
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);
                return new StatusCodeResult(500);
            }
        }

        [FunctionName("DeleteClub")]
        public async Task<IActionResult> DeleteClub([HttpTrigger(AuthorizationLevel.Anonymous, "delete", Route = "club/{clubId}")] HttpRequest req,
            string clubId,
            ILogger log)
        {
            try
            {
                CosmosClient client = new CosmosClient(Environment.GetEnvironmentVariable("CosmosDB"));
                var container = client.GetContainer("Padel", "clubs");

                await container.DeleteItemAsync<Task>(clubId, new PartitionKey(clubId));

                return new OkObjectResult("verwijdered");
            }
            catch (Exception ex)
            {
                log.LogError(ex.Message);

                return new StatusCodeResult(500);
            }
        }

    }
}
