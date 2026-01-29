const FeatureFlag = require('../../models/FeatureFlag');
const { successResponse, errorResponse } = require('../../Shared/Utils');

// ------------------------------------------------------------------
// Create Feature Flag
// ------------------------------------------------------------------
exports.createFeatureFlag = async (req, res) => {
    try {
        const featureFlag = new FeatureFlag({
            ...req.body,
            createdBy: req.adminId,
        });

        await featureFlag.save();

        res.status(201).json(successResponse(featureFlag, 'Feature flag created'));
    } catch (error) {
        console.error('Error creating feature flag:', error);
        if (error.code === 11000) {
            return res.status(400).json(errorResponse('Feature flag already exists'));
        }
        res.status(500).json(errorResponse('Failed to create feature flag'));
    }
};

// ------------------------------------------------------------------
// Get All Feature Flags
// ------------------------------------------------------------------
exports.getFeatureFlags = async (req, res) => {
    try {
        const featureFlags = await FeatureFlag.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json(successResponse(featureFlags));
    } catch (error) {
        console.error('Error fetching feature flags:', error);
        res.status(500).json(errorResponse('Failed to fetch feature flags'));
    }
};

// ------------------------------------------------------------------
// Update Feature Flag
// ------------------------------------------------------------------
exports.updateFeatureFlag = async (req, res) => {
    try {
        const featureFlag = await FeatureFlag.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!featureFlag) {
            return res.status(404).json(errorResponse('Feature flag not found', 404));
        }

        res.json(successResponse(featureFlag, 'Feature flag updated'));
    } catch (error) {
        console.error('Error updating feature flag:', error);
        res.status(500).json(errorResponse('Failed to update feature flag'));
    }
};

// ------------------------------------------------------------------
// Delete Feature Flag
// ------------------------------------------------------------------
exports.deleteFeatureFlag = async (req, res) => {
    try {
        const featureFlag = await FeatureFlag.findByIdAndDelete(req.params.id);

        if (!featureFlag) {
            return res.status(404).json(errorResponse('Feature flag not found', 404));
        }

        res.json(successResponse(null, 'Feature flag deleted'));
    } catch (error) {
        console.error('Error deleting feature flag:', error);
        res.status(500).json(errorResponse('Failed to delete feature flag'));
    }
};

// ------------------------------------------------------------------
// Toggle Feature Flag
// ------------------------------------------------------------------
exports.toggleFeatureFlag = async (req, res) => {
    try {
        const featureFlag = await FeatureFlag.findById(req.params.id);

        if (!featureFlag) {
            return res.status(404).json(errorResponse('Feature flag not found', 404));
        }

        featureFlag.isEnabled = !featureFlag.isEnabled;

        if (featureFlag.isEnabled) {
            featureFlag.enabledAt = new Date();
            featureFlag.disabledAt = null;
        } else {
            featureFlag.disabledAt = new Date();
        }

        await featureFlag.save();

        res.json(
            successResponse(
                featureFlag,
                `Feature ${featureFlag.isEnabled ? 'enabled' : 'disabled'}`
            )
        );
    } catch (error) {
        console.error('Error toggling feature flag:', error);
        res.status(500).json(errorResponse('Failed to toggle feature flag'));
    }
};

// ------------------------------------------------------------------
// Update Rollout Percentage
// ------------------------------------------------------------------
exports.updateRollout = async (req, res) => {
    try {
        const { rolloutPercentage } = req.body;

        if (rolloutPercentage < 0 || rolloutPercentage > 100) {
            return res
                .status(400)
                .json(errorResponse('Rollout percentage must be between 0 and 100'));
        }

        const featureFlag = await FeatureFlag.findByIdAndUpdate(
            req.params.id,
            { rolloutPercentage },
            { new: true }
        );

        if (!featureFlag) {
            return res.status(404).json(errorResponse('Feature flag not found', 404));
        }

        res.json(successResponse(featureFlag, 'Rollout updated'));
    } catch (error) {
        console.error('Error updating rollout:', error);
        res.status(500).json(errorResponse('Failed to update rollout'));
    }
};

// ------------------------------------------------------------------
// Get User Features (Mobile)
// ------------------------------------------------------------------
exports.getUserFeatures = async (req, res) => {
    try {
        const user = req.user;

        const featureFlags = await FeatureFlag.find({ isEnabled: true });

        const enabledFeatures = featureFlags
            .filter((ff) => ff.isEnabledForUser(user))
            .map((ff) => ({
                name: ff.name,
                displayName: ff.displayName,
                description: ff.description,
            }));

        res.json(successResponse(enabledFeatures));
    } catch (error) {
        console.error('Error fetching user features:', error);
        res.status(500).json(errorResponse('Failed to fetch features'));
    }
};
