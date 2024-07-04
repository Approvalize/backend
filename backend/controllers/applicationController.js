const Application = require('../models/application');

// const createApplication = async (req, res) => {
//   try {
//     console.log("Request body:", req.body);
//     const { title, description, approverPath } = req.body;
//     const creatorId = req.user.id; 
//     const newApplication = new Application({
//       title,
//       description,
//       approverPath,
//       creatorId,
//       currentApproverIndex: 0,
//     });
//     await newApplication.save();
//     res.status(201).json({ success: true, applicationId: newApplication._id });
//   } catch (err) {
//     console.error("Error creating application:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };



// const createApplication = async (req, res) => {
//   try {
//     console.log("Request body:", req.body);

//     const { title, description, approverPath } = req.body;

//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ success: false, message: 'Unauthorized' });
//     }

//     const creatorId = req.user.id;

//     const newApplication = new Application({
//       title,
//       description,
//       approverPath,
//       creatorId,
//       currentApproverIndex: 0,
//     });

//     await newApplication.save();

//     res.status(201).json({ success: true, applicationId: newApplication._id });
//   } catch (err) {
//     console.error("Error creating application:", err);
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

const createApplication = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { title, description, approverPath } = req.body;

    // For testing purposes without authentication
    const creatorId = '667f945ed84007003f3c3bef';

    const newApplication = new Application({
      title,
      description,
      approverPath,
      StatusMap: new Map(),//new
      creatorId,
      currentApproverIndex: 0,
    });

    await newApplication.save();

    res.status(201).json({ success: true, applicationId: newApplication._id });
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};




const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json(application);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const editApplication = async (req, res) => {
  try {
    const { title, description, approverPath } = req.body;
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (application.creatorId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    application.title = title || application.title;
    application.description = description || application.description;
    application.approverPath = approverPath || application.approverPath;
    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    await Application.deleteOne({ _id: req.params.applicationId });
    res.json({ success: true, message: 'Application removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({ creatorId: req.params.userId });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllApplicationsForApprover = async (req, res) => {
  const { userId } = req.params;

  try {
    const applications = await Application.find({
      approverPath: { $elemMatch: { $eq: userId } }
    });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const approveApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    const approver = req.user.id;
    if (application.approverPath[application.currentApproverIndex] !== approver) {
      return res.status(403).json({ success: false, message: 'Not authorized to approve' });
    }
    application.currentApproverIndex++;
    if (application.currentApproverIndex >= application.approverPath.length) {
      application.status = 'Approved';
      application.StatusMap.set(approver.toString(), 'Approved');//new
    }   

    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const rejectApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    const approver = req.user.id;
    if (application.approverPath[application.currentApproverIndex] !== approver) {
      return res.status(403).json({ success: false, message: 'Not authorized to reject' });
    }
    application.status = 'Rejected';
    application.StatusMap.set(approver.toString(), 'Rejected');//new

    await application.save();
    res.json({ success: true, application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.json({ status: application.status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


//new
const getApproverStatus = async (req, res) => {
  try {
    const { applicationId, approverId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const status = application.approverStatusMap.get(approverId);
    if (!status) {
      return res.status(404).json({ message: 'Approver not found or status not set' });
    }

    res.status(200).json({ approverId, status });
  } catch (err) {
    console.error('Get Approver Status Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createApplication,
  getApplication,
  editApplication,
  deleteApplication,
  getAllApplications,
  getAllApplicationsForApprover,
  approveApplication,
  rejectApplication,
  getApplicationStatus,
  getApproverStatus
};
