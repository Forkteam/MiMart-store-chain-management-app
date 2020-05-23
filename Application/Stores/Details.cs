using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Domain;
using MediatR;
using Persistence;
namespace Application.Stores
{
     public class Details
    {
        public class Query : IRequest<Store>
        {
            public Guid Id { get; set; }
        }
        //Handler object xử lý tất cả các bussiness logic
        public class Handler : IRequestHandler<Query, Store>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Store> Handle(Query request, CancellationToken cancellationToken)
            {
                //handler logic
                var Store = await _context.Stores.FindAsync(request.Id);
                //đây là kiểu Eager Load
                // .Include(x => x.UserArticles)
                // .ThenInclude(x => x.AppUser)
                //dùng cái này thì k dùng FindAsync
                // .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (Store == null)
                {
                    throw new RestException(HttpStatusCode.NotFound, new { Store = "Not Found" });
                }
                return Store;
            }
        }
    }
}