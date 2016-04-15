using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Filters;
using Microsoft.AspNet.Mvc.ViewEngines;
using System.IO;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.AspNet.Mvc.ViewFeatures;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace Google.Maps.Init.Controllers
{

    public class HomeController : Controller
    {
        public override void OnActionExecuted(ActionExecutedContext context)
        {            
            base.OnActionExecuted(context);
        }

        // GET: /<controller>/
        public IActionResult Index()
        {           
            return View();
        }
    }
}
