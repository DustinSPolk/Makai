USE [Makai]
GO
/****** Object:  StoredProcedure [dbo].[Messages_Delete_ById]    Script Date: 5/10/2023 11:54:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dustin Polk
-- Create date: 03-14-2023
-- Description: Delete Messages by Id
-- Code Reviewer:

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================
ALTER proc [dbo].[Messages_Delete_ById]
	@Id int

as

/* --- TEST ---

	DECLARE @Id int = 1

	SELECT *
	FROM [dbo].[Messages]
	WHERE Id = @Id

	EXECUTE [dbo].[Messages_Delete_ById] @Id

	SELECT *
	FROM [dbo].[Messages]
	WHERE Id = @Id

*/

BEGIN

	DELETE FROM [dbo].[Messages]
	WHERE Id = @Id

END
