using Microsoft.AspNet.Mvc.Razor;
using Microsoft.Extensions.OptionsModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Google.Maps.Init.ViewEngine
{
    public class CustomViewEngine : RazorViewEngine
    {
        public CustomViewEngine(IRazorPageFactory pageFactory,
            IRazorViewFactory viewFactory,
            IOptions<RazorViewEngineOptions> optionsAccessor,
            IViewLocationCache viewLocationCache)
                : base(pageFactory,
                      viewFactory,
                      optionsAccessor,
                      viewLocationCache)
            {
        }

        public override IEnumerable<string> AreaViewLocationFormats
        {
            get
            {
                return base.AreaViewLocationFormats;
            }
        }

        public override IEnumerable<string> ViewLocationFormats
        {
            get
            {
                return base.ViewLocationFormats;
            }
        }
    }
}
