import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getProject } from '../database/dynamoDB';
import { errorResponse, successResponse } from '../utils/response';

export const getProjectHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};
    if (!id) {
      return errorResponse(400, 'Project ID is required');
    }

    const project = await getProject(id);
    if (!project) {
      return errorResponse(404, 'Project not found');
    }
    
    return successResponse(200, project);
  } catch (err) {
    console.log(err);
    return errorResponse(500, 'An error occurred while retrieving the project');
  }
};
