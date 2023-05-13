import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { updateProject } from '../database/dynamoDB';
import { errorResponse, successResponse } from '../utils/response';
import { Project } from '../models';

export const updateProjectHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};
    if (!id) {
      return errorResponse(400, 'Project ID is required');
    }

    const updateData: Partial<Project> = JSON.parse(event.body || '{}');
    if (!updateData || Object.keys(updateData).length === 0) {
      return errorResponse(400, 'No update data provided');
    }

    const updatedProject = await updateProject(id, updateData);
    if (!updatedProject) {
      return errorResponse(404, 'Project not found');
    }
    
    return successResponse(200, updatedProject);
  } catch (err) {
    console.log(err);
    return errorResponse(500, 'An error occurred while updating the project');
  }
};
