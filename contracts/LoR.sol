// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract LoR {

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    struct Student {
        uint256 id;
        string name;
        string course;
        string email;
        bool recommendationRequested;
        bool recommendationApproved;
    }

    uint256 public studentCount;

    mapping(uint256 => Student) public students;
    mapping(address => bool) public approvers;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyApprover() {
        require(approvers[msg.sender], "Not authorized");
        _;
    }

    function authorizeApprover(address _approver)
        public
        onlyOwner
    {
        approvers[_approver] = true;
    }

    function deauthorizeApprover(address _approver)
        public
        onlyOwner
    {
        approvers[_approver] = false;
    }

    function addStudent(
        string memory _name,
        string memory _course,
        string memory _email
    ) public {

        studentCount++;

        students[studentCount] = Student(
            studentCount,
            _name,
            _course,
            _email,
            false,
            false
        );
    }

    function requestRecommendation(
        uint256 _studentId
    ) public {

        require(
            _studentId <= studentCount &&
            _studentId > 0,
            "Student not found"
        );

        students[_studentId]
            .recommendationRequested = true;
    }

    function approveRecommendation(
        uint256 _studentId
    )
        public
        onlyApprover
    {
        require(
            students[_studentId]
                .recommendationRequested,
            "Request not made"
        );

        students[_studentId]
            .recommendationApproved = true;
    }

    function getStudent(
        uint256 _studentId
    )
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            string memory,
            bool,
            bool
        )
    {
        Student memory s =
            students[_studentId];

        return (
            s.id,
            s.name,
            s.course,
            s.email,
            s.recommendationRequested,
            s.recommendationApproved
        );
    }
}
