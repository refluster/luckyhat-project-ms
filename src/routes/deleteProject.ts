import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteProject } from '../database/dynamoDB';
import { errorResponse, successResponse } from '../utils/response';

export const deleteProjectHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};
    if (!id) {
      return errorResponse(400, 'Project ID is required');
    }

    await deleteProject(id);
    return successResponse(204, {});
  } catch (err) {
    console.log(err);
    return errorResponse(500, 'An error occurred while deleting the project');
  }
};
