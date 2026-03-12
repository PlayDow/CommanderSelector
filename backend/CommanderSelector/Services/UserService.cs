using CommanderSelector.Models;
using CommanderSelector.Models.IServices;
using CommanderSelector.Repositories;

namespace CommanderSelector.Services;

public class UserService(UserRepository userRepository) : IUserService
{
    private readonly UserRepository _userRepository = userRepository;

    public void RecordPlay(User user)
    {
        _playRepository.InsertPlay(user);
    }
}